'use client';
import React, { useState, useEffect } from 'react';
import { updateCostComponents } from '@/utils/updateCostComponents';
import { calculateTime } from '@/utils/calculateTime';
import getQuoteDetails from '@/utils/getQuoteDetails';
import updateQuoteCost from '@/utils/updateQuoteCost';
import MemberCustomCost from './MemberCustomCost';
import { getTotalTime } from '@/utils/setTotalTimeCostCalculator';
import LoadingSpinner from './loadingScreen';

interface MemberGetCostProps {
    quoteID: any;
}
type InputField = 'salary' | 'payrollTax' | 'overhead' | 'profitPercent';

const MemberGetCost: React.FC<MemberGetCostProps> = ({ quoteID }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [monthTime, setMonthTime] = useState<number>(0);
    const [dayTime, setDayTime] = useState<number>(0);

    const [inputValues, setInputValues] = useState({
        salary: '0',
        payrollTax: '0',
        overhead: '0',
        profitPercent: '0',
    });

    const [originalValues, setOriginalValues] = useState({ ...inputValues });

    const [editState, setEditState] = useState({
        salaryEdit: false,
        payrollTaxEdit: false,
        overheadEdit: false,
        profitPercentEdit: false,
    });

    const [preProfitCost, setPreProfitCost] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<number>(0);
    const [useCustomCost, setUseCustomCost] = useState(false);

    const [isUsingCustomCost, setIsUsingCustomCost] = useState(false);

    const [isConfirming, setIsConfirming] = useState(false);

    const [customAmount, setCustomAmount] = useState<number>(0);

    const calculatePreProfitCost = () => {
        const laborCost = monthTime * parseFloat(inputValues.salary);
        const finalPayroll = parseFloat(inputValues.payrollTax) * monthTime;
        const finalOverhead = parseFloat(inputValues.overhead) * monthTime;
        const preProfit = laborCost + finalOverhead + finalPayroll;
        setPreProfitCost(preProfit);
    };

    const calculateCost = async () => {
        const finalCost = preProfitCost / (1 - parseFloat(inputValues.profitPercent) / 100);
        setTotalCost(finalCost);
    };

    const updateDB = async () => {
        await updateQuoteCost(quoteID, { baseCost: totalCost, customCost: false });
    }

    useEffect(() => {
        const setTimes = async () => {
            const timeDetails = await calculateTime(quoteID);
            const totalTime = timeDetails.totalTime;
            const quoteDetails: any = await getQuoteDetails(quoteID);
            console.log(quoteDetails)
            const quoteCostInfo = quoteDetails.costInfo
            if (quoteCostInfo.customCost === true) {
                setIsUsingCustomCost(true)
                setCustomAmount(quoteCostInfo.baseCost)
            }
            const frequency = quoteDetails.quoteInfo.frequency;
            const costCalculations = quoteDetails.costCalculations;
            const monthDayTime = await getTotalTime(frequency, totalTime);

            setDayTime(monthDayTime.dayTime);
            setMonthTime(monthDayTime.monthTime);

            setInputValues({
                salary: costCalculations.salary.toString(),
                payrollTax: costCalculations.payrollTax.toString(),
                overhead: costCalculations.overhead.toString(),
                profitPercent: costCalculations.profitPercent.toString(),
            });

            setOriginalValues({
                salary: costCalculations.salary.toString(),
                payrollTax: costCalculations.payrollTax.toString(),
                overhead: costCalculations.overhead.toString(),
                profitPercent: costCalculations.profitPercent.toString(),
            });

            setIsLoading(false);
        };

        setTimes();
    }, [quoteID]);

    useEffect(() => {
        calculatePreProfitCost();
    }, [inputValues.salary, inputValues.payrollTax, inputValues.overhead]);

    useEffect(() => {
        calculatePreProfitCost();
        calculateCost();
    }, [preProfitCost, inputValues.profitPercent]);

    const handleInputChange = (field: string) => (value: string) => {
        console.log(`Changing input for ${field}: ${value}`)
        if (!/^\d*\.?\d*$/.test(value)) {
            console.log('Invalid format')
            return
        }; // Allow only non-negative numbers and decimals
        setIsUsingCustomCost(false)
        setInputValues((prev) => ({ ...prev, [field]: value }));
        setEditState((prev) => ({ ...prev, [`${field}Edit`]: true }));
    };

    const handleBlur = (field: InputField) => {
        if (isConfirming) {
            // If the user is confirming, skip resetting the input
            return;
        }

        setInputValues((prev) => ({ ...prev, [field]: originalValues[field] }));
        setEditState((prev) => ({ ...prev, [`${field}Edit`]: false }));
    };

    const handleConfirm = async (componentType: InputField) => {
        console.log('Confirm');

        const numericValue = parseFloat(inputValues[componentType] || '0');
        console.log(`Confirm setting ${componentType} to ${numericValue}`);

        // Call updateCostComponents with the correct value
        await updateCostComponents(quoteID, { [componentType]: numericValue });
        await updateDB();
        // Update original values and clear the edit state
        setOriginalValues((prev) => ({ ...prev, [componentType]: inputValues[componentType] }));
        setEditState((prev) => ({ ...prev, [`${componentType}Edit`]: false }));
    };

    const onConfirmCustom = async (customCost: number) => {
        // Reset all values in the input state
        setInputValues({
            salary: '0',
            payrollTax: '0',
            overhead: '0',
            profitPercent: '0',
        });

        setOriginalValues({
            salary: '0',
            payrollTax: '0',
            overhead: '0',
            profitPercent: '0',
        });

        // Update cost components with 0 values
        updateCostComponents(quoteID, { salary: 0, payrollTax: 0, overhead: 0, profitPercent: 0 });
        setIsUsingCustomCost(true)
        // Set and update the total cost
        setCustomAmount(customCost);
        await updateQuoteCost(quoteID, { baseCost: customCost, finalCost: customCost, customCost: true });
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="bg-[#001F54] text-white p-10 rounded-xl shadow-xl max-w-lg mx-auto border-2 border-yellow-500 space-y-8">
            <h2 className="text-4xl font-bold text-yellow-500 text-center">Cost Calculator</h2>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold">Hours</h3>
                <div className="flex justify-between">
                    <p className="text-lg">Daily: <span className="font-bold">{dayTime.toFixed(2)}</span> hrs</p>
                    <p className="text-lg">Monthly: <span className="font-bold">{monthTime.toFixed(2)}</span> hrs</p>
                </div>
            </div>

            {[
                { label: 'Hourly Salary ($)', field: 'salary' as InputField },
                { label: 'Payroll Tax (%)', field: 'payrollTax' as InputField },
                { label: 'Overhead ($)', field: 'overhead' as InputField },
                { label: 'Profit Percentage (%)', field: 'profitPercent' as InputField },
            ].map(({ label, field }) => (
                <div key={field}>
                    <label className="block text-yellow-400 font-medium mb-2">{label}</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={inputValues[field]}
                            onChange={(e) => handleInputChange(field)(e.target.value)}
                            onBlur={() => handleBlur(field)}
                            className="w-full p-3 border-2 rounded-lg text-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />

                        {(editState[`${field}Edit`] && inputValues[field].trim() !== '' && inputValues[field] !== originalValues[field]) && (
                            <button
                                onMouseDown={() => setIsConfirming(true)}  // Set the flag before the blur event fires
                                onClick={() => {
                                    handleConfirm(field);
                                    setIsConfirming(false);  // Reset the flag after confirming
                                }}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 transition"
                            >
                                Confirm
                            </button>
                        )}
                    </div>
                </div>
            ))}

            <div className="space-y-4">
                {isUsingCustomCost ? (
                    <p className="text-xl">Custom Cost:
                        <span className="font-bold">
                            {isNaN(customAmount) ? ' Loading...' : ` $${customAmount.toFixed(2)}`}
                        </span>
                    </p>
                ) : (
                    <div>
                        <p className="text-xl">Pre-Profit Cost:
                            <span className="font-bold">
                                {isNaN(preProfitCost) ? ' Loading...' : ` $${preProfitCost.toFixed(2)}`}
                            </span>
                        </p>
                        <p className="text-xl text-yellow-400">Total Cost:
                            <span className="text-white">
                                {isNaN(totalCost) ? ' Loading...' : ` $${totalCost.toFixed(2)}`}
                            </span>
                        </p>
                    </div>
                )}
            </div>


            <div className="space-y-4">
                {useCustomCost ? (
                    <MemberCustomCost onConfirmCustom={onConfirmCustom} initialCustomCost={customAmount} onExit={() => setUseCustomCost(false)} />
                ) : (
                    <button
                        onClick={() => setUseCustomCost(true)}
                        className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-400 transition"
                    >
                        <span className="text-white">
                            {isUsingCustomCost ? 'Edit' : 'Set'} Custom Cost Instead
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default MemberGetCost;