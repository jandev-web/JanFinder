import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { Schema } from '../../data/resource';

// -------------------- DDB setup --------------------
const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient(), {
  marshallOptions: { removeUndefinedValues: true },
});

const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || 'CustomerQuotes';
const TASKS  = process.env.ROOM_TASKS_TABLE || 'RoomTaskCalculations';
const FAC    = process.env.FACILITY_TABLE || 'Facility_Data';

// -------------------- Helpers --------------------
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
  'Quarterly': 0.333333,
  'Yearly': 0.083333,
  'NA': 0,
};

// --- NEW: Frequency normalization (drop-in resilient against typos) ---
const FREQ_ALIASES: Record<string, string> = {
  // common typos/cases
  'quaterly': 'Quarterly',
  'quarterly': 'Quarterly',
  'one time': 'One Time',
  'biweekly': 'Bi-Weekly',
  'bi-weekly': 'Bi-Weekly',
  'daily-1': 'Daily-1',
  'daily': 'Daily',
  'monthly': 'Monthly',
  'weekly': 'Weekly',
  'na': 'NA',
  '1 day a week': '1 Day a Week',
  '2 days a week': '2 Days a Week',
  '3 days a week': '3 Days a Week',
  '4 days a week': '4 Days a Week',
  '5 days a week': '5 Days a Week',
  '6 days a week': '6 Days a Week',
  '7 days a week': '7 Days a Week',
};

function normFreq(input: any, dbg?: (from: string, to: string) => void): string {
  const raw = String(input ?? '').trim();
  if (!raw) return '';
  const key = raw.toLowerCase();
  const normalized = FREQ_ALIASES[key] ?? raw;
  if (dbg && normalized !== raw) dbg(raw, normalized); // hook for logging where we fixed it
  return normalized;
}

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

// --- NEW: Package/Room name normalization (defensive) ---
function normPkgName(s: string): 'top' | 'middle' | 'bottom' | '' {
  const k = String(s || '').trim().toLowerCase();
  if (k.startsWith('top')) return 'top';
  if (k.startsWith('mid')) return 'middle';
  if (k.startsWith('bot')) return 'bottom';
  return '' as const;
}

const ROOM_ALIASES: Record<string, string> = {
  'treatment/procedure rooms': 'Treatment / Procedure Rooms',
  'treatment - procedure rooms': 'Treatment / Procedure Rooms',
  'exam room': 'Exam Rooms',
};

function normRoomKey(name: string): string {
  const s = String(name || '')
    .replace(/\s*\/\s*/g, ' / ')
    .replace(/\s+/g, ' ')
    .trim();
  const key = s.toLowerCase();
  return ROOM_ALIASES[key] ?? s;
}

// --- NEW: single source of truth for multipliers ---
function pickMultiplier({
  customerFrequency,
  customerMultiplier,
  packageFrequency,
}: {
  customerFrequency: string;
  customerMultiplier: number;
  packageFrequency: string;
}) {
  const cf = normFreq(customerFrequency);
  const pf = normFreq(packageFrequency);

  if (cf === 'Quarterly' || cf === 'One Time') {
    return customerMultiplier;
  }

  if (cf === 'Monthly') {
    if (pf === 'Quarterly') return FREQ_MULTIPLIER['Quarterly'];
    return customerMultiplier;
  }

  if (pf === 'Daily') return customerMultiplier;

  if (pf === 'Daily-1') {
    if (['2 Days a Week','3 Days a Week','4 Days a Week','5 Days a Week','6 Days a Week','7 Days a Week'].includes(cf)) {
      const downgraded = DAILY_1_DOWNGRADE[cf] || cf;
      return FREQ_MULTIPLIER[downgraded] ?? 0;
    }
    return FREQ_MULTIPLIER[cf] ?? 0;
  }

  return FREQ_MULTIPLIER[pf] ?? 0;
}

export const handler: Schema['calculatePackageOptions']['functionHandler'] = async (event, context) => {
  const reqId = context?.awsRequestId || 'no-reqid';
  const t0 = Date.now();
  let ddbReads = 0;

  // --- lightweight counters ---
  let tasksEvaluated = 0, tasksSkippedNoFormula = 0, tasksSkippedNoFreq = 0, tasksErrored = 0;
  let freqTyposFound = 0; // counts places we saw and auto-normalized 'quaterly' (or other aliases)

  const log = (msg: string, extra?: Record<string, any>) =>
    console.log(JSON.stringify({ at: 'calcPackageOptions', reqId, msg, ...(extra || {}) }));

  try {
    const quoteID = event.arguments?.quoteID as string | undefined;
    if (!quoteID) throw new Error('quoteID is required');

    log('start', { quoteID });

    // Load quote
    const tLoadQuote = Date.now();
    const quoteRes = await ddbDoc.send(new GetCommand({
      TableName: QUOTES,
      Key: { QuoteID: quoteID },
    }));
    ddbReads++;
    const quoteItem = quoteRes.Item as any;
    if (!quoteItem) {
      log('quote-not-found');
      return { message: 'Quote not found', packageOptions: [] };
    }
    log('quote-loaded', { ms: Date.now() - tLoadQuote });

    const quoteInfo = quoteItem.quoteInfo ?? {};
    const roomTypes = Array.isArray(quoteInfo.roomTypes) ? quoteInfo.roomTypes : [];
    const totalSqft = num(quoteInfo.sqft);
    const floorTypes = quoteInfo.floorTypes ?? {};
    const customerFacility = quoteInfo.facilityType;

    // --- normalize customer frequency with debug hook
    let customerFreqNormalizationLogged = false;
    const customerFrequency = normFreq(String(quoteInfo.frequency ?? ''), (from, to) => {
      if (!customerFreqNormalizationLogged) {
        log('normalized-customer-frequency', { from, to });
        customerFreqNormalizationLogged = true;
        if (from.toLowerCase() === 'quaterly') freqTyposFound++;
      }
    });
    const customerMultiplier = FREQ_MULTIPLIER[customerFrequency] ?? 0;

    log('input-summary', {
      facility: customerFacility || '(none)',
      frequency: customerFrequency || '(none)',
      roomsCount: roomTypes.length,
      totalSqft,
    });

    if (!customerFacility) {
      log('missing-facilityType');
      return { message: 'Missing facilityType', packageOptions: [] };
    }

    type PkgKey = 'top' | 'middle' | 'bottom';
    type Pkg = {
      packageName: PkgKey;
      packageCost: number;
      rooms: any[];
      totalDayTime: number;
      totalMonthTime: number;
      otherDayTime: number;
      otherMonthTime: number;
      hardfloor?: { tasks: any[]; totalDayTime: number; totalMonthTime: number; totalDayTimeFromMonth?: number };
      carpet?: { tasks: any[]; totalDayTime: number; totalMonthTime: number; totalDayTimeFromMonth?: number };
    };
    const packages: Record<PkgKey, Pkg> = {
      top:    { packageName: 'top',    packageCost: 0, rooms: [], totalDayTime: 0, totalMonthTime: 0, otherDayTime: 0, otherMonthTime: 0 },
      middle: { packageName: 'middle', packageCost: 0, rooms: [], totalDayTime: 0, totalMonthTime: 0, otherDayTime: 0, otherMonthTime: 0 },
      bottom: { packageName: 'bottom', packageCost: 0, rooms: [], totalDayTime: 0, totalMonthTime: 0, otherDayTime: 0, otherMonthTime: 0 },
    };

    // --- Cache & instrumented loader that reports *exact* typo locations ---
    const taskCache = new Map<string, any>();
    const getTaskData = async (roomName: string) => {
      const lookup = normRoomKey(roomName);
      if (taskCache.has(lookup)) return taskCache.get(lookup);

      const res = await ddbDoc.send(new GetCommand({
        TableName: TASKS,
        Key: { RoomName: lookup }, // ensure this matches your PK
      }));
      ddbReads++;
      const item = (res.Item as any) ?? {};
      taskCache.set(lookup, item);

      if (!item || Object.keys(item).length === 0) {
        log('warn-missing-taskData', { requested: roomName, lookup });
      } else {
        // Scan the nested arrays for bad spellings and log precise paths
        const tasksArr = Array.isArray(item.roomTasks) ? item.roomTasks : [];
        for (let ti = 0; ti < tasksArr.length; ti++) {
          const t = tasksArr[ti];
          const freqs = Array.isArray(t?.taskFrequency) ? t.taskFrequency : [];
          for (let fi = 0; fi < freqs.length; fi++) {
            const raw = String(freqs[fi]?.packageFrequency ?? '');
            const normalized = normFreq(raw);
            if (normalized !== raw) {
              // *** This log points at the exact item & indexes where the typo is ***
              log('DATA-TYPO-frequency', {
                roomKey: lookup,
                roomNameOriginal: roomName,
                taskIndex: ti,
                freqIndex: fi,
                valueFound: raw,
                normalizedTo: normalized,
                pathHint: `RoomTaskCalculations[RoomName="${lookup}"].roomTasks[${ti}].taskFrequency[${fi}].packageFrequency`,
              });
              freqTyposFound++;
            }
          }
        }
      }
      return item;
    };

    // ---------- Room sqft estimates ----------
    const tRooms = Date.now();
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

    log('rooms-processing-begin', { roomsPreview: roomTypes.slice(0, 5).map((r: any) => r.roomName || r.roomType) });

    for (const r of roomTypes) {
      const roomName = String((r.roomName ?? r.roomType) ?? '');
      const roomNumber = num(r.count);
      const taskData = await getTaskData(roomName);

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
    log('rooms-estimated', { ms: Date.now() - tRooms, totalEstimatedSqft });

    const discrepancy = totalSqft - totalEstimatedSqft;

    // ---------- Facility weights ----------
    const tFac = Date.now();
    const facRes = await ddbDoc.send(new GetCommand({
      TableName: FAC,
      Key: { FacilityName: customerFacility },
    }));
    ddbReads++;
    const facilityItem = (facRes.Item as any) ?? {};
    const roomsArr = Array.isArray(facilityItem.Rooms) ? facilityItem.Rooms : [];
    if (!roomsArr.length) log('warn-missing-facility-rooms', { customerFacility });

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
    log('facility-weights-applied', { ms: Date.now() - tFac, totalWeighted });

    // ---------- Build per-room tasks into packages ----------
    const tTasks = Date.now();
    for (const room of roomEstimates) {
      const roomName = room.roomName;
      const roomNumber = room.roomNumber || 1;
      const adjustedSqft = num(room.adjustedSqft);

      const taskData = await getTaskData(roomName);
      const distributedSqft = roomNumber ? adjustedSqft / roomNumber : adjustedSqft; // per-room sqft

      // Create room in each package
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
      if (!tasksArr.length) {
        log('warn-no-roomTasks', { roomName });
        continue;
      }

      for (let ti = 0; ti < tasksArr.length; ti++) {
        const t = tasksArr[ti];
        const taskName = String(t.taskName);
        const formula = t.taskCalculation;
        const freqs = Array.isArray(t.taskFrequency) ? t.taskFrequency : [];
        if (!formula) { tasksSkippedNoFormula++; continue; }
        if (freqs.length === 0) { tasksSkippedNoFreq++; continue; }

        let dailyTime = 0;
        try {
          // *** FIX: use PER-ROOM sqft, not aggregate ***
          dailyTime = evalFormula(String(formula), { roomNumber: Number(roomNumber), roomSqft: Number(distributedSqft) });
        } catch (err: any) {
          tasksErrored++;
          log('warn-eval-formula', { roomName, taskName, err: String(err).slice(0, 200) });
          continue;
        }

        for (let fi = 0; fi < freqs.length; fi++) {
          const f = freqs[fi];
          const pkgName = normPkgName(String(f.packageName));
          if (!pkgName) { log('warn-unknown-pkg', { forTask: taskName, raw: f.packageName }); continue; }

          // normalize and record if we changed it
          let frequency = normFreq(f.packageFrequency, (from, to) => {
            log('DATA-TYPO-frequency', {
              roomKey: normRoomKey(roomName),
              taskIndex: ti,
              freqIndex: fi,
              valueFound: from,
              normalizedTo: to,
              pathHint: `RoomTaskCalculations[RoomName="${normRoomKey(roomName)}"].roomTasks[${ti}].taskFrequency[${fi}].packageFrequency`,
            });
            freqTyposFound++;
          });

          const multiplier = pickMultiplier({
            customerFrequency,
            customerMultiplier,
            packageFrequency: frequency,
          });

          const monthlyTime = dailyTime * multiplier;
          const pkg = packages[pkgName];
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

          tasksEvaluated++;
        }
      }
    }
    log('room-tasks-finished', { ms: Date.now() - tTasks });

    // ---------- Floor tasks ----------
    const tFloor = Date.now();
    await processFloorTasks({
      totalSqft,
      floorTypes,
      customerFrequency,
      customerMultiplier,
      packages,
      reqId,
      ddbReadsRef: { v: ddbReads },
      getTaskData,
      log,
      onFreqTypo: () => { freqTyposFound++; },
    });
    log('floor-tasks-finished', { ms: Date.now() - tFloor });

    // ---------- Other time ----------
    const otherTime = totalSqft * 0.004; // minutes/day
    for (const pkg of Object.values(packages)) {
      pkg.otherDayTime = otherTime;
      pkg.otherMonthTime = otherTime * customerMultiplier;
      pkg.totalDayTime += pkg.otherDayTime;
      pkg.totalMonthTime += pkg.otherMonthTime;
    }

    // ---------- Round and finalize ----------
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
      bottom: 'Essentials',
      middle: 'Pristine',
      top: 'Elite',
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

    // Persist
    const tUpdate = Date.now();
    await ddbDoc.send(new UpdateCommand({
      TableName: QUOTES,
      Key: { QuoteID: quoteID },
      UpdateExpression: 'SET #P = :packages',
      ExpressionAttributeNames: { '#P': 'Package' },
      ExpressionAttributeValues: { ':packages': { packageOptions } },
      ReturnValues: 'NONE',
    }));
    log('persisted', { ms: Date.now() - tUpdate });

    // Final high-signal logs
    log('task-stats', {
      tasksEvaluated,
      tasksSkippedNoFormula,
      tasksSkippedNoFreq,
      tasksErrored,
      freqTyposFound,
    });

    log('done', {
      totalMs: Date.now() - t0,
      ddbReads,
      pkgCosts: packageOptions.map(p => ({ type: p.packageType, cost: p.packageCost })),
    });

    return { message: 'OK', packageOptions };
  } catch (e: any) {
    console.error(JSON.stringify({
      at: 'calcPackageOptions',
      level: 'error',
      reqId,
      errName: e?.name,
      errMessage: e?.message,
      stack: e?.stack?.split('\n').slice(0, 5).join('\n'),
    }));
    throw new Error(e?.message || 'Internal server error');
  }
};

async function processFloorTasks(args: {
  totalSqft: number;
  floorTypes: any;
  customerFrequency: string;
  customerMultiplier: number;
  packages: Record<'top' | 'middle' | 'bottom', any>;
  reqId: string;
  ddbReadsRef: { v: number };
  getTaskData: (roomName: string) => Promise<any>;
  log: (msg: string, extra?: Record<string, any>) => void;
  onFreqTypo: () => void;
}) {
  const { totalSqft, floorTypes, customerFrequency, customerMultiplier, packages, getTaskData, log, onFreqTypo } = args;
  const floorRoomTypes: Record<string, string> = { hardfloor: 'Hardfloor', carpet: 'Carpet' };

  for (const [floorKey, roomLabel] of Object.entries(floorRoomTypes)) {
    if (!(floorKey in floorTypes)) continue;

    const pct = num(floorTypes[floorKey]); // % of total
    const sqft = totalSqft * (pct / 100);

    const taskData = await getTaskData(roomLabel);
    const tasksArr = Array.isArray(taskData?.roomTasks) ? taskData.roomTasks : [];
    if (tasksArr.length === 0) {
      log('warn-no-floorTasks', { floorKey, roomLabel });
      continue;
    }

    for (const [pkgKey, pkg] of Object.entries(packages)) {
      (pkg as any)[floorKey] = { tasks: [], totalDayTime: 0, totalMonthTime: 0 };

      for (let ti = 0; ti < tasksArr.length; ti++) {
        const t = tasksArr[ti];
        const taskName = String(t.taskName);
        const formula = t.taskCalculation;
        const freqs = Array.isArray(t.taskFrequency) ? t.taskFrequency : [];
        if (!formula || freqs.length === 0) continue;

        let dailyTime = 0;
        try {
          dailyTime = evalFormula(String(formula), { roomNumber: 1, roomSqft: Number(sqft) });
        } catch (err: any) {
          log('warn-eval-floor-formula', { floorKey, taskName, err: String(err).slice(0, 200) });
          continue;
        }

        for (let fi = 0; fi < freqs.length; fi++) {
          const f = freqs[fi];

          // only apply to the relevant package
          const normalizedPkgName = normPkgName(String(f.packageName));
          if (normalizedPkgName !== pkgKey) continue;

          // normalize and log exact path if we changed it
          let frequency = normFreq(f.packageFrequency, (from, to) => {
            log('DATA-TYPO-frequency', {
              roomKey: roomLabel,
              taskIndex: ti,
              freqIndex: fi,
              valueFound: from,
              normalizedTo: to,
              pathHint: `RoomTaskCalculations[RoomName="${roomLabel}"].roomTasks[${ti}].taskFrequency[${fi}].packageFrequency`,
            });
            onFreqTypo();
          });

          const multiplier = pickMultiplier({
            customerFrequency,
            customerMultiplier,
            packageFrequency: frequency,
          });

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
