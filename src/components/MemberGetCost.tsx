'use client';
import React, { useState, useEffect } from 'react';
import { updateCostComponents } from '@/utils/updateCostComponents';
import { calculateTime } from '@/utils/calculateTime'
import getQuoteDetails from '@/utils/getQuoteDetails';
import updateQuoteCost from '@/utils/updateQuoteCost';

interface MemberGetCostProps {
    quoteID: any;
}

const MemberGetCost: React.FC<MemberGetCostProps> = ({ quoteID }) => {
    const [monthTime, setMonthTime] = useState<number>(0);
    const [dayTime, setDayTime] = useState<number>(0);

    const [salary, setSalary] = useState(0)
    const [payrollTax, setPayrollTax] = useState(0)
    const [overhead, setOverhead] = useState(0)
    const [profitPercent, setProfitPercent] = useState(0)

    const [salaryEdit, setSalaryEdit] = useState(false)
    const [payrollTaxEdit, setPayrollTaxEdit] = useState(false)
    const [overheadEdit, setOverheadEdit] = useState(false)
    const [profitPercentEdit, setProfitPercentEdit] = useState(false)

    const [preProfitCost, setPreProfitCost] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<number>(0);

    const calculatePreProfitCost = () => {
        const laborCost = monthTime * salary;
        const finalPayroll = payrollTax * monthTime;
        const finalOverhead = overhead * monthTime;
        const preProfit = laborCost + finalOverhead + finalPayroll;
        setPreProfitCost(preProfit);
    };

    const calculateCost = async () => {
        const finalCost = preProfitCost / (1 - (profitPercent / 100));
        console.log(finalCost);
        await updateQuoteCost(quoteID, {base: finalCost, custom: false})
        setTotalCost(finalCost);
    };

    useEffect(() => {
        const setTimes = async () => {
            const timeDetails = await calculateTime(quoteID);
            const totalTime = timeDetails.totalTime
            console.log(totalTime)
            const quoteDetails = await getQuoteDetails(quoteID)
            const frequency = quoteDetails.quoteInfo.frequency
            console.log(quoteDetails)
            const costCalclations = quoteDetails.costCalculations

            console.log(costCalclations)
            setSalary(costCalclations.salary)
            setPayrollTax(costCalclations.payrollTax)
            setOverhead(costCalclations.overhead)
            setProfitPercent(costCalclations.profitPercent)
            
            switch (frequency) {
                case 'None':
                case null:
                    setDayTime(0);
                    setMonthTime(0);
                    break;
                case 'One Time':
                    setDayTime(totalTime / 60);
                    setMonthTime(1);
                    break;
                case 'Weekly':
                    setDayTime(totalTime / 60);
                    setMonthTime((totalTime * 4.33) / 60);
                    break;
                case '2 Days a Week':
                    setDayTime(totalTime / 60);
                    setMonthTime((totalTime * 8.66) / 60);
                    break;
                case '3 Days a Week':
                    setDayTime(totalTime / 60);
                    setMonthTime((totalTime * 13) / 60);
                    break;
                case '4 Days a Week':
                    setDayTime(totalTime / 60);
                    setMonthTime((totalTime * 17.33) / 60);
                    break;
                case '5 Days a Week':
                    setDayTime(totalTime / 60);
                    setMonthTime((totalTime * 21.66) / 60);
                    break;
                case '6 Days a Week':
                    setDayTime(totalTime / 60);
                    setMonthTime((totalTime * 26) / 60);
                    break;
                case '7 Days a Week':
                    setDayTime(totalTime / 60);
                    setMonthTime((totalTime * 30) / 60);
                    break;
                case '1 Day a Month':
                    setDayTime(totalTime / 60);
                    setMonthTime(totalTime / 60);
                    break;
                case 'Quarterly':
                case 'Yearly':
                    setDayTime(totalTime / 60);
                    setMonthTime(0);
                    break;
                default:
                    setDayTime(totalTime / 60);
                    setMonthTime(0);
                    break;
            }
            calculatePreProfitCost()
            calculateCost()
        };
    
        setTimes();
    }, [quoteID]);

    useEffect(() => {
        const setCosts = () => {
            
            calculatePreProfitCost()
            calculateCost()
        };
    
        setCosts();
    }, [salary, payrollTax, overhead, profitPercent, preProfitCost,]);

    const changeOverhead = (newOverhead: any) => {
        setOverhead(parseFloat(newOverhead))
        setOverheadEdit(true)
        calculatePreProfitCost()
        calculateCost();

    }

    const changeSalary = (newSalary: any) => {
        setSalary(parseFloat(newSalary))
        setSalaryEdit(true)
        calculatePreProfitCost();
        calculateCost();

    }

    const changePayroll = (newPayroll: any) => {
        setPayrollTax(parseFloat(newPayroll))
        setPayrollTaxEdit(true)
        calculatePreProfitCost();
        calculateCost();

    }

    const changeProfit = (newProfit: any) => {
        setProfitPercent(parseFloat(newProfit))
        setProfitPercentEdit(true)
        calculateCost();
    }

    const handleConfirm = (componentType: any) => {
        if (componentType === 'salary') {
            updateCostComponents(quoteID, { salary: salary })
            setSalaryEdit(false)
        }
        if (componentType === 'overhead') {
            updateCostComponents(quoteID, { overhead: overhead })
            setOverheadEdit(false)
        }
        if (componentType === 'payrollTax') {
            updateCostComponents(quoteID, { payrollTax: payrollTax })
            setPayrollTaxEdit(false)
        }
        if (componentType === 'profit') {
            updateCostComponents(quoteID, { profitPercent: profitPercent })
            setProfitPercentEdit(false)
        }
        calculatePreProfitCost();
    }

    return (
        <div className="bg-[#001F54] text-white p-10 rounded-lg shadow-xl max-w-lg mx-auto border-2 border-yellow-500">
            <h2 className="text-3xl font-extrabold mb-6 text-yellow-500 text-center">Cost Calculator</h2>
            <div>
                <p>Hours</p>
                <div>
                    <p>{(dayTime).toFixed(2)} /day</p>
                    <p>{(monthTime).toFixed(2)} /mo</p>
                </div>
            </div>

            <label className="block text-yellow-500 font-semibold mb-2">Hourly Salary ($)</label>
            <div className="flex space-x-2">
                <input
                    type="number"
                    value={salary}
                    onChange={(e) => changeSalary(e.target.value)}
                    className="w-full p-3 border-2 border-yellow-500 rounded-lg text-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                {salaryEdit && (
                    <button
                        onClick={() => handleConfirm('salary')}
                        className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-400 transition"
                    >
                        Confirm
                    </button>
                )}
            </div>

            <label className="block text-yellow-500 font-semibold mt-4 mb-2">Payroll Tax</label>
            <div className="flex space-x-2">
                <input
                    type="number"
                    value={payrollTax}
                    onChange={(e) => changePayroll(e.target.value)}
                    className="w-full p-3 border-2 border-yellow-500 rounded-lg text-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                {payrollTaxEdit && (
                    <button
                        onClick={() => handleConfirm('payrollTax')}
                        className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-400 transition"
                    >
                        Confirm
                    </button>
                )}
            </div>

            <label className="block text-yellow-500 font-semibold mt-4 mb-2">Overhead</label>
            <div className="flex space-x-2">
                <input
                    type="number"
                    value={overhead}
                    onChange={(e) => changeOverhead(e.target.value)}
                    className="w-full p-3 border-2 border-yellow-500 rounded-lg text-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                {overheadEdit && (
                    <button
                        onClick={() => handleConfirm('overhead')}
                        className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-400 transition"
                    >
                        Confirm
                    </button>
                )}
            </div>

            <label className="block text-yellow-500 font-semibold mt-4 mb-2">Profit Percentage (%)</label>
            <div className="flex space-x-2">
                <input
                    type="number"
                    value={profitPercent}
                    onChange={(e) => changeProfit(e.target.value)}
                    className="w-full p-3 border-2 border-yellow-500 rounded-lg text-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                {profitPercentEdit && (
                    <button
                        onClick={() => handleConfirm('profit')}
                        className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-400 transition"
                    >
                        Confirm
                    </button>
                )}
            </div>

            <p className="mt-4">Pre-Profit Cost: ${preProfitCost.toFixed(2)}</p>


            <p className="text-yellow-500 font-semibold text-lg mt-4">Total Cost: <span className="text-white">${totalCost.toFixed(2)}</span></p>
        </div>
    );
};


export default MemberGetCost;