function recPackageUtil(packageOptions, budget) {
    console.log(packageOptions)
    console.log(budget)
    const option1 = packageOptions.find((pkg) => pkg.packageType === 'bottom');
    const option2 = packageOptions.find((pkg) => pkg.packageType === 'middle');
    const option3 = packageOptions.find((pkg) => pkg.packageType === 'top');

    const cost1 = option1.totalTime * 15;
    const cost2 = option2.totalTime * 15;
    const cost3 = option3.totalTime * 15;
    console.log(option1)
    const diff1 = Math.abs(budget - cost1);
    const diff2 = Math.abs(budget - cost2);
    const diff3 = Math.abs(budget - cost3);
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
