'use client';
import React, { useState, useEffect } from 'react';

interface MemberCostCalculatorProps {
    initialTime: number;
    frequency: any;
}

const MemberCostCalculator: React.FC<MemberCostCalculatorProps> = ({ initialTime, frequency }) => {
    const [profitPercentage, setProfitPercentage] = useState<number>(20);
    const [salary, setSalary] = useState<number>(15);
    const [totalCost, setTotalCost] = useState<number>(0);
    const [monthTime, setMonthTime] = useState<number>(0);
    const [dayTime, setDayTime] = useState<number>(initialTime);
    
    
    useEffect(() => {
        const setTimes = async () => {
            try {
                switch (frequency) {
                    case 'None':
                    case null:
                        setDayTime(0);
                        setMonthTime(0);
                        break;
                    case 'One Time':
                        setDayTime(initialTime);
                        setMonthTime(1);
                        break;
                    case 'Weekly':
                        setDayTime(initialTime);
                        setMonthTime(initialTime*4.33);
                        break;
                    case '2 Days a Week':
                        setDayTime(initialTime);
                        setMonthTime(initialTime*8.66);
                        break;
                    case '3 Days a Week':
                        setDayTime(initialTime);
                        setMonthTime(initialTime*13);
                        break;
                    case '4 Days a Week':
                        setDayTime(initialTime);
                        setMonthTime(initialTime*17.33);
                        break;
                    case '5 Days a Week':
                        setDayTime(initialTime);
                        setMonthTime(initialTime*21.66);
                        break;
                    case '6 Days a Week':
                        setDayTime(initialTime);
                        setMonthTime(initialTime*26);
                        break;
                    case '7 Days a Week':
                        setDayTime(initialTime);
                        setMonthTime(initialTime*30);
                        break;
                    case '1 Day a Month':
                        setDayTime(initialTime);
                        setMonthTime(initialTime);
                        break;
                    case 'Quarterly':
                        setDayTime(initialTime);
                        setMonthTime(0);
                        break;
                    case 'Yearly':
                        setDayTime(initialTime);
                        setMonthTime(0);
                        break;
                    default:
                        setDayTime(initialTime);
                        setMonthTime(0);
                        break;
                }
            } catch (error) {
                console.error('Error fetching quote frequency:', error);
            }
        };

        setTimes();
    }, [frequency]);


    

    const calculateCost = () => {
        const laborCost = initialTime * salary;
        const profitAmount = (profitPercentage / 100) * laborCost;
        const finalCost = laborCost + profitAmount;
        setTotalCost(finalCost);
    };

    return (
        <div className="bg-[#001F54] text-white p-10 rounded-lg shadow-xl max-w-lg mx-auto border-2 border-yellow-500">
            <h2 className="text-3xl font-extrabold mb-6 text-yellow-500 text-center">Cost Calculator</h2>
            <div>
                <p>Hours</p>
                <div>
                    <p>{dayTime/60}/day</p>
                    <p>{monthTime/60}/mo</p>
                </div>

                <p></p>
            </div>

            {/* Profit Percentage Input */}
            <label className="block text-yellow-500 font-semibold mb-2">Profit Percentage (%)</label>
            <input
                type="number"
                value={profitPercentage}
                onChange={(e) => setProfitPercentage(parseFloat(e.target.value))}
                className="w-full p-3 border-2 border-yellow-500 rounded-lg text-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
            />

            {/* Salary Input */}
            <label className="block text-yellow-500 font-semibold mb-2">Hourly Salary ($)</label>
            <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(parseFloat(e.target.value))}
                className="w-full p-3 border-2 border-yellow-500 rounded-lg text-[#001F54] focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
            />

            {/* Calculate Button */}
            <button
                onClick={calculateCost}
                className="w-full py-2 bg-yellow-500 text-[#001F54] font-bold rounded-lg hover:bg-yellow-400 transition-all mb-4"
            >
                Calculate Cost
            </button>

            {/* Display Total Cost */}
            <p className="text-yellow-500 font-semibold text-lg">Total Cost: <span className="text-white">${totalCost.toFixed(2)}</span></p>
        </div>
    );
};

export default MemberCostCalculator;
