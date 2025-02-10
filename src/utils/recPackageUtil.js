function recPackageUtil(cost, budget) {
    const option1 = cost;
    const option2 = cost / 1.2;
    const option3 = cost * 0.64;

    const diff1 = Math.abs(budget - option1);
    const diff2 = Math.abs(budget - option2);
    const diff3 = Math.abs(budget - option3);

    if (diff1 <= diff2 && diff1 <= diff3) {
        return 'Elite Pristine';
    } else if (diff2 <= diff1 && diff2 <= diff3) {
        return 'Radiant Results';
    } else {
        return 'Pure Essentials';
    }
}

export default recPackageUtil;
