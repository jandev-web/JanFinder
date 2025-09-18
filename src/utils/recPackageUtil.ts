// src/utils/recPackageUtil.ts

export default function recPackageUtil(packageOptions: any, budget: number) {
  const options = Array.isArray(packageOptions)
    ? packageOptions
    : Object.values(packageOptions ?? {}).filter(Boolean);

  if (!options.length || !Number.isFinite(budget)) return null;

  const tierOrder = ['bottom', 'middle', 'top'];

  const result = options.reduce(
    (acc: { best: any; diff: number }, pkg: any) => {
      const cost = Number(pkg?.packageCost);
      if (!Number.isFinite(cost)) return acc;

      const d = Math.abs(budget - cost);

      // first valid or strictly closer
      if (!acc.best || d < acc.diff) return { best: pkg, diff: d };

      // tie-breaker: prefer higher tier (bottom < middle < top)
      if (d === acc.diff) {
        const bestIdx = tierOrder.indexOf(acc.best?.packageType ?? '');
        const newIdx = tierOrder.indexOf(pkg?.packageType ?? '');
        if (newIdx > bestIdx) return { best: pkg, diff: d };
      }

      return acc;
    },
    { best: null as any, diff: Infinity }
  );

  return result.best.packageType;
}
