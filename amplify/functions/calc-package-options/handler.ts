import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { Schema } from '../../data/resource';

// DDB setup
const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient(), {
  marshallOptions: { removeUndefinedValues: true },
});

const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';
const TASKS  = process.env.ROOM_TASKS_TABLE || 'RoomTaskCalculations';
const FAC    = process.env.FACILITY_TABLE || 'Facility_Data';

// Helpers
const round2 = (n: number) => Number((Math.round(n * 100) / 100).toFixed(2));
const num = (v: any) => (typeof v === 'number' ? v : Number(v || 0));

const DAILY_1_DOWNGRADE: Record<string, string> = {
  '7 Days a Week': '6 Days a Week',
  '6 Days a Week': '5 Days a Week',
  '5 Days a Week': '4 Days a Week',
  '4 Days a Week': '3 Days a Week',
  '3 Days a Week': '2 Days a Week',
  '2 Days a Week': '1 Day a Week',
  '1 Day a Week': 'Weekly',
};

const FREQ_MULTIPLIER: Record<string, number> = {
  'One Time': 1,
  'Weekly': 4.33,
  '1 Day a Week': 4.33,
  '2 Days a Week': 8.66,
  '3 Days a Week': 12.99,
  '4 Days a Week': 17.32,
  '5 Days a Week': 21.65,
  '6 Days a Week': 25.98,
  '7 Days a Week': 30.31,
  'Bi-Weekly': 2.17,
  'Monthly': 1,
  'Quarterly': 0.333333, // note: data sometimes uses "Quaterly"
  'Yearly': 0.083333,
  'NA': 0,
};

function normalizeFormula(formula: string) {
  return String(formula)
    .replace(/Decimal\s*\(/g, '(')
    .replace(/float\s*\(/g, 'Number(');
}

function evalFormula(formula: string, vars: { roomNumber: number; roomSqft: number }) {
  const src = normalizeFormula(formula);
  // eslint-disable-next-line no-new-func
  const fn = new Function('roomNumber', 'roomSqft', 'Number', `return (${src});`);
  const val = fn(vars.roomNumber, vars.roomSqft, Number);
  const out = Number(val);
  if (!isFinite(out)) throw new Error('Formula produced non-finite value');
  return out;
}

// ✅ Amplify Data ONLY
export const handler: Schema['calculatePackageOptions']['functionHandler'] = async (event) => {
  try {
    const quoteID = event.arguments?.quoteID as string | undefined;
    if (!quoteID) throw new Error('quoteID is required');

    // Load quote
    const quoteRes = await ddbDoc.send(new GetCommand({
      TableName: QUOTES,
      Key: { QuoteID: quoteID },
    }));
    const quoteItem = quoteRes.Item as any;
    if (!quoteItem) {
      // benign payload to avoid breaking client code
      return { message: 'Quote not found', packageOptions: [] };
    }

    const quoteInfo = quoteItem.quoteInfo ?? {};
    const roomTypes = Array.isArray(quoteInfo.roomTypes) ? quoteInfo.roomTypes : [];
    const totalSqft = num(quoteInfo.sqft);
    const floorTypes = quoteInfo.floorTypes ?? {};
    const customerFrequency = String(quoteInfo.frequency ?? '');
    const customerFacility = quoteInfo.facilityType;

    if (!customerFacility) {
      // benign payload; client reads packageOptions
      return { message: 'Missing facilityType', packageOptions: [] };
    }

    const customerMultiplier = FREQ_MULTIPLIER[customerFrequency] ?? 0;

    type PkgKey = 'top' | 'middle' | 'bottom';
    type Pkg = {
      packageName: PkgKey;
      packageCost: number;
      rooms: any[];
      totalDayTime: number;
      totalMonthTime: number;
      otherDayTime: number;
      otherMonthTime: number;
      hardfloor?: { tasks: any[]; totalDayTime: number; totalMonthTime: number };
      carpet?: { tasks: any[]; totalDayTime: number; totalMonthTime: number };
    };
    const packages: Record<PkgKey, Pkg> = {
      top:    { packageName: 'top',    packageCost: 0, rooms: [], totalDayTime: 0, totalMonthTime: 0, otherDayTime: 0, otherMonthTime: 0 },
      middle: { packageName: 'middle', packageCost: 0, rooms: [], totalDayTime: 0, totalMonthTime: 0, otherDayTime: 0, otherMonthTime: 0 },
      bottom: { packageName: 'bottom', packageCost: 0, rooms: [], totalDayTime: 0, totalMonthTime: 0, otherDayTime: 0, otherMonthTime: 0 },
    };

    // Initial per-room sqft estimates
    let totalEstimatedSqft = 0;
    const roomEstimates: Array<{
      roomName: string;
      roomNumber: number;
      avgRoomSize: number;
      baseSqft: number;
      adjustedSqft?: number;
      weight?: number;
      weightedCount?: number;
    }> = [];

    for (const r of roomTypes) {
      const roomName = String(r.roomName);
      const roomNumber = num(r.numberOfRooms);

      const taskDataRes = await ddbDoc.send(new GetCommand({
        TableName: TASKS,
        Key: { RoomName: roomName },
      }));
      const taskData = (taskDataRes.Item as any) ?? {};

      let avgRoomSize: number;
      const percent = taskData?.avgRoomSizePercent;
      if (percent !== undefined && percent !== '') {
        avgRoomSize = num(totalSqft) * (num(percent) / 100);
      } else {
        avgRoomSize = num(taskData?.avgRoomSize ?? 100);
      }

      const estSqft = roomNumber * avgRoomSize;
      totalEstimatedSqft += estSqft;
      roomEstimates.push({ roomName, roomNumber, avgRoomSize, baseSqft: estSqft });
    }

    const discrepancy = totalSqft - totalEstimatedSqft;

    // Facility weights
    const facRes = await ddbDoc.send(new GetCommand({
      TableName: FAC,
      Key: { FacilityName: customerFacility },
    }));
    const facilityItem = (facRes.Item as any) ?? {};
    const roomsArr = Array.isArray(facilityItem.Rooms) ? facilityItem.Rooms : [];
    const roomWeights = new Map<string, number>(roomsArr.map((r: any) => [String(r.roomName), num(r.roomWeight ?? 1)]));

    let totalWeighted = 0;
    for (const est of roomEstimates) {
      const w = roomWeights.get(est.roomName) ?? 1;
      est.weight = w;
      est.weightedCount = est.roomNumber * w;
      totalWeighted += est.weightedCount;
    }
    for (const est of roomEstimates) {
      const ratio = totalWeighted ? (est.weightedCount! / totalWeighted) : 0;
      const sqftAdj = ratio * discrepancy;
      est.adjustedSqft = est.baseSqft + sqftAdj;
    }

    // Build per-room tasks into packages
    for (const room of roomEstimates) {
      const roomName = room.roomName;
      const roomNumber = room.roomNumber || 1;
      const adjustedSqft = num(room.adjustedSqft);

      const taskDataRes = await ddbDoc.send(new GetCommand({
        TableName: TASKS,
        Key: { RoomName: roomName },
      }));
      const taskData = (taskDataRes.Item as any) ?? {};
      const distributedSqft = roomNumber ? adjustedSqft / roomNumber : adjustedSqft;

      // create room in each package
      for (const p of Object.values(packages)) {
        p.rooms.push({
          roomName,
          roomSize: distributedSqft,
          roomNumber,
          roomTasks: [],
          totalDayTime: 0,
          totalMonthTime: 0,
        });
      }

      const tasksArr = Array.isArray(taskData?.roomTasks) ? taskData.roomTasks : [];
      for (const t of tasksArr) {
        const taskName = String(t.taskName);
        const formula = t.taskCalculation;
        const freqs = Array.isArray(t.taskFrequency) ? t.taskFrequency : [];
        if (!formula || freqs.length === 0) continue;

        let dailyTime = 0;
        try {
          dailyTime = evalFormula(String(formula), { roomNumber: Number(roomNumber), roomSqft: Number(adjustedSqft) });
        } catch {
          continue;
        }

        for (const freq of freqs) {
          const pkgName = String(freq.packageName) as PkgKey;
          let frequency = String(freq.packageFrequency);

          let multiplier: number | undefined;
          if (customerFrequency === 'Quaterly' || customerFrequency === 'One Time') {
            frequency = customerFrequency;
            multiplier = customerMultiplier;
          } else if (customerFrequency === 'Monthly') {
            if (frequency !== 'Quaterly') {
              frequency = customerFrequency;
              multiplier = customerMultiplier;
            } else {
              multiplier = FREQ_MULTIPLIER[frequency];
            }
          } else {
            if (frequency === 'Daily') {
              multiplier = customerMultiplier;
            } else if (frequency === 'Daily-1') {
              if (['2 Days a Week','3 Days a Week','4 Days a Week','5 Days a Week','6 Days a Week','7 Days a Week'].includes(customerFrequency)) {
                const newFreq = DAILY_1_DOWNGRADE[customerFrequency] || customerFrequency;
                multiplier = FREQ_MULTIPLIER[newFreq];
              } else {
                multiplier = FREQ_MULTIPLIER[customerFrequency];
              }
            } else {
              multiplier = FREQ_MULTIPLIER[frequency];
            }
          }

          multiplier ??= 0;
          const monthlyTime = dailyTime * multiplier;
          const pkg = packages[pkgName];
          if (!pkg) continue;

          const lastRoom = pkg.rooms[pkg.rooms.length - 1];
          lastRoom.roomTasks.push({
            taskName,
            frequency,
            timePerDay: dailyTime,
            timePerMonth: monthlyTime,
            timePerDayFromMonthly: monthlyTime / 30.31,
          });
          lastRoom.totalDayTime += dailyTime;
          lastRoom.totalMonthTime += monthlyTime;
          pkg.totalDayTime += dailyTime;
          pkg.totalMonthTime += monthlyTime;
        }
      }
    }

    // Floor tasks
    await processFloorTasks({
      totalSqft,
      floorTypes,
      customerFrequency,
      customerMultiplier,
      packages,
    });

    // Other time (travel, misc)
    const otherTime = totalSqft * 0.004; // minutes/day
    for (const pkg of Object.values(packages)) {
      pkg.otherDayTime = otherTime;
      pkg.otherMonthTime = otherTime * customerMultiplier;
      pkg.totalDayTime += pkg.otherDayTime;
      pkg.totalMonthTime += pkg.otherMonthTime;
    }

    // Round and finalize
    for (const pkg of Object.values(packages)) {
      pkg.totalDayTime = round2(pkg.totalDayTime);
      pkg.totalMonthTime = round2(pkg.totalMonthTime);
      pkg.otherDayTime = round2(pkg.otherDayTime);
      pkg.otherMonthTime = round2(pkg.otherMonthTime);
      (pkg as any).totalDayTimeFromMonth = round2(pkg.totalMonthTime / 30.31);
      (pkg as any).otherDayTimeFromMonth = round2(pkg.otherMonthTime / 30.31);
      pkg.packageCost = round2(pkg.totalMonthTime);

      for (const room of pkg.rooms) {
        room.totalDayTime = round2(room.totalDayTime);
        room.totalMonthTime = round2(room.totalMonthTime);
        room.totalDayTimeFromMonth = round2(room.totalMonthTime / 30.31);
        for (const task of room.roomTasks) {
          task.timePerDay = round2(task.timePerDay);
          task.timePerMonth = round2(task.timePerMonth);
          task.timePerDayFromMonthly = round2(task.timePerMonth / 30.31);
        }
      }

      for (const ft of ['hardfloor', 'carpet'] as const) {
        const sec = (pkg as any)[ft];
        if (!sec) continue;
        sec.totalDayTime = round2(sec.totalDayTime);
        sec.totalMonthTime = round2(sec.totalMonthTime);
        sec.totalDayTimeFromMonth = round2(sec.totalMonthTime / 30.31);
        for (const t of sec.tasks) {
          t.timePerDay = round2(t.timePerDay);
          t.timePerMonth = round2(t.timePerMonth);
        }
      }
    }

    const packageNameMap: Record<PkgKey, string> = {
      bottom: 'Pure Essentials',
      middle: 'Radiant Results',
      top: 'Elite Pristine',
    };

    const packageOptions = (Object.keys(packages) as PkgKey[]).map((k) => {
      const p = packages[k];
      return {
        packageType: k,
        packageName: packageNameMap[k] || '',
        packageCost: p.packageCost,
        totalDayTime: p.totalDayTime,
        totalMonthTime: p.totalMonthTime,
        totalDayTimeFromMonth: (p as any).totalDayTimeFromMonth,
        otherDayTime: p.otherDayTime,
        otherMonthTime: p.otherMonthTime,
        otherDayTimeFromMonth: (p as any).otherDayTimeFromMonth,
        rooms: p.rooms,
        hardfloor: (p as any).hardfloor ?? [],
        carpet: (p as any).carpet ?? [],
      };
    });

    // Persist to the quote
    await ddbDoc.send(new UpdateCommand({
      TableName: QUOTES,
      Key: { QuoteID: quoteID },
      UpdateExpression: 'SET #P = :packages',
      ExpressionAttributeNames: { '#P': 'Package' },
      ExpressionAttributeValues: { ':packages': { packageOptions } },
      ReturnValues: 'NONE',
    }));

    return { message: 'OK', packageOptions };
  } catch (e: any) {
    console.error('calcPackageOptions error:', e);
    // For AppSync, throwing returns a GraphQL error
    throw new Error(e?.message || 'Internal server error');
  }
};

async function processFloorTasks(args: {
  totalSqft: number;
  floorTypes: any;
  customerFrequency: string;
  customerMultiplier: number;
  packages: Record<'top' | 'middle' | 'bottom', any>;
}) {
  const { totalSqft, floorTypes, customerFrequency, customerMultiplier, packages } = args;
  const floorRoomTypes: Record<string, string> = { hardfloor: 'Hardfloor', carpet: 'Carpet' };

  for (const [floorKey, roomLabel] of Object.entries(floorRoomTypes)) {
    if (!(floorKey in floorTypes)) continue;

    const pct = num(floorTypes[floorKey]); // % of total
    const sqft = totalSqft * (pct / 100);

    const taskDataRes = await ddbDoc.send(new GetCommand({
      TableName: TASKS,
      Key: { RoomName: roomLabel },
    }));
    const taskData = (taskDataRes.Item as any) ?? {};
    const tasksArr = Array.isArray(taskData?.roomTasks) ? taskData.roomTasks : [];
    if (tasksArr.length === 0) continue;

    for (const [pkgKey, pkg] of Object.entries(packages)) {
      (pkg as any)[floorKey] = { tasks: [], totalDayTime: 0, totalMonthTime: 0 };

      for (const t of tasksArr) {
        const taskName = String(t.taskName);
        const formula = t.taskCalculation;
        const freqs = Array.isArray(t.taskFrequency) ? t.taskFrequency : [];
        if (!formula || freqs.length === 0) continue;

        let dailyTime = 0;
        try {
          dailyTime = evalFormula(String(formula), { roomNumber: 1, roomSqft: Number(sqft) });
        } catch {
          continue;
        }

        for (const f of freqs) {
          if (String(f.packageName) !== pkgKey) continue;

          let frequency = String(f.packageFrequency);
          let multiplier: number | undefined;

          if (customerFrequency === 'Quaterly' || customerFrequency === 'One Time') {
            frequency = customerFrequency;
            multiplier = customerMultiplier;
          } else if (customerFrequency === 'Monthly') {
            if (frequency !== 'Quaterly') {
              frequency = customerFrequency;
              multiplier = customerMultiplier;
            } else {
              multiplier = FREQ_MULTIPLIER[frequency];
            }
          } else {
            if (frequency === 'Daily') {
              multiplier = customerMultiplier;
            } else if (frequency === 'Daily-1') {
              if (['2 Days a Week','3 Days a Week','4 Days a Week','5 Days a Week','6 Days a Week','7 Days a Week'].includes(customerFrequency)) {
                const newFreq = DAILY_1_DOWNGRADE[customerFrequency] || customerFrequency;
                multiplier = FREQ_MULTIPLIER[newFreq];
              } else {
                multiplier = FREQ_MULTIPLIER[customerFrequency];
              }
            } else {
              multiplier = FREQ_MULTIPLIER[frequency];
            }
          }

          multiplier ??= 0;
          const monthlyTime = dailyTime * multiplier;

          (pkg as any)[floorKey].tasks.push({
            taskName,
            frequency,
            timePerDay: dailyTime,
            timePerMonth: monthlyTime,
            timePerDayFromMonthly: monthlyTime / 30.31,
          });

          (pkg as any)[floorKey].totalDayTime += dailyTime;
          (pkg as any)[floorKey].totalMonthTime += monthlyTime;
          pkg.totalDayTime += dailyTime;
          pkg.totalMonthTime += monthlyTime;
        }
      }
    }
  }
}
