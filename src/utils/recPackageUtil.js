function recPackageUtil(packageOptions, budget) {
    console.log(packageOptions)
    console.log(budget)
    const option1 = packageOptions.find((pkg) => pkg.packageType === 'bottom');
    const option2 = packageOptions.find((pkg) => pkg.packageType === 'middle');
    const option3 = packageOptions.find((pkg) => pkg.packageType === 'top');

    console.log(option1)
    const diff1 = Math.abs(budget - option1.packageCost);
    const diff2 = Math.abs(budget - option2.packageCost);
    const diff3 = Math.abs(budget - option3.packageCost);
    console.log(diff1)
    console.log(diff2)
    console.log(diff3)

    if (diff1 <= diff2 && diff1 <= diff3) {
        console.log('Top')
        return 'top';
    } else if (diff2 <= diff1 && diff2 <= diff3) {
        console.log('Middle')
        return 'middle';
    } else {
        console.log('bottom')
        return 'bottom';
    }
}

export default recPackageUtil;
