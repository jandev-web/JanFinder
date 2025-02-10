import { calculateTime } from '@/utils/calculateTime'
import { updateCostComponents } from '@/utils/updateCostComponents';
import updateQuoteCost from '@/utils/updateQuoteCost';
import { getTotalTime } from '@/utils/setTotalTimeCostCalculator';

export const calculateUpdateCost = async (quoteID, frequency) => {
    
    try {
        const componentInfo = {payrollTax: 4, overhead: 4, salary: 15, profitPercent: 10}
        
        const timeDetails = await calculateTime(quoteID);
        const totalTime = timeDetails.totalTime;

        const monthDayTime = await getTotalTime(frequency, totalTime);
        const monthTime = monthDayTime.monthTime

        const laborCost = monthTime * parseFloat(componentInfo.salary);
        const finalPayroll = parseFloat(componentInfo.payrollTax) * monthTime;
        const finalOverhead = parseFloat(componentInfo.overhead) * monthTime;
        let preProfit = laborCost + finalOverhead + finalPayroll;

        
        preProfit = Math.round(preProfit * 100) / 100;
        let finalCost = preProfit / (1 - parseFloat(componentInfo.profitPercent) / 100);

        
        finalCost = Math.round(finalCost * 100) / 100;

        const costInfo = {finalCost: null, baseCost: finalCost, customCost: false}

        await updateCostComponents(quoteID, componentInfo)
        await updateQuoteCost(quoteID, costInfo)

    } catch (error) {
        console.error('Error getting time:', error);
        throw new Error('An unexpected error occurred while getting time. Please try again later.');
    }
};
