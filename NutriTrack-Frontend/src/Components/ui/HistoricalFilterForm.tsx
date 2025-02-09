import React, { useState } from 'react';

const HistoricalFilterForm: React.FC = ( {onSubmit}) => {
    const [selectedOption, setSelectedOption] = useState('month');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedOption !== null) {
            onSubmit(selectedOption); // Pass selected value to parent
        }
    };

    return (
        <form className="w-full max-w-full flex justify-center" onSubmit={handleSubmit}>
            <div className="flex flex-row items-center p-4">
                <label className="inline-flex items-center mt-2">
                    <input
                        type="radio"
                        className="form-radio text-blue-600"
                        name="timeAgg"
                        value="week"
                        checked={selectedOption === 'week'}
                        onChange={() => setSelectedOption('week')}
                    />
                    <span className="ml-2">Week</span>
                </label>
                <label className="inline-flex items-center mt-2">
                    <input
                        type="radio"
                        className="form-radio text-blue-600"
                        name="timeAgg"
                        value="month"
                        checked={selectedOption === 'month'}
                        onChange={() => setSelectedOption('month')}
                    />
                    <span className="ml-2">Month</span>
                </label>
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

export default HistoricalFilterForm;
