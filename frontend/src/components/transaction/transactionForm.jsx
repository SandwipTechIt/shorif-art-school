import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { postApi } from '../../api';
import { toast } from 'react-toastify';

const TransactionForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        type: 'income',
        createdAt: new Date(),
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({
            ...prev,
            createdAt: date,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await postApi('createTransaction', formData);
            toast.success('Transaction created successfully');
            setFormData({
                title: '',
                amount: '',
                type: 'income',
                createdAt: new Date(),
            });
        } catch (err) {
            toast.error('Failed to create transaction. Please try again.');
            setError('Failed to create transaction. Please try again.');
        }
    };

    return (
        <div className="flex bg-white/50 items-center justify-center p-4">
            <div className="w-full max-w-xl bgGlass rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Add New Transaction</h1>
                </div>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                        <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-1">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Transaction Title
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition duration-200"
                                placeholder="Transaction Title"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                            Amount
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                                type="text"
                                id="amount"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition duration-200"
                                placeholder="Enter amount"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Transaction Type
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${formData.type === 'income' ? 'bg-green-50 border-green-500 ring-2 ring-green-200' : 'border-gray-300 hover:bg-gray-50'}`}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="income"
                                    checked={formData.type === 'income'}
                                    onChange={handleChange}
                                    className="sr-only"
                                />
                                <div className="flex flex-col items-center">
                                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span className="mt-2 font-medium text-gray-700">Income</span>
                                </div>
                            </label>

                            <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${formData.type === 'expense' ? 'bg-red-50 border-red-500 ring-2 ring-red-200' : 'border-gray-300 hover:bg-gray-50'}`}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="expense"
                                    checked={formData.type === 'expense'}
                                    onChange={handleChange}
                                    className="sr-only"
                                />
                                <div className="flex flex-col items-center">
                                    <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                    </svg>
                                    <span className="mt-2 font-medium text-gray-700">Expense</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700">
                            Date
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <DatePicker
                                selected={formData.createdAt}
                                onChange={handleDateChange}
                                dateFormat="dd/MM/yyyy"
                                maxDate={new Date()}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none transition duration-200"
                                wrapperClassName="w-full"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow-md  transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {status === 'submitting' ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : 'Add Transaction'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TransactionForm;