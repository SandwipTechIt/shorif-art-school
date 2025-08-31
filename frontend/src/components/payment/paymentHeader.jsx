import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { postApi } from '../../api';
import { toast } from 'react-toastify';
function SearchComponent({ onSearch }) {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault()
        if(!fromDate && !toDate && !searchQuery){
            toast.error("Please select a date range or search query");
            return;
        }
        try {
            const response = await postApi("/searchPayments", { fromDate, toDate, searchQuery });
            onSearch(response?.data);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Unable to search payments");
        }
    };

    return (
        <div className="p-6 bgGlass rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Search by Date Range</h2>
            <form
                className="flex flex-col md:flex-row lg:items-end gap-4"
                onSubmit={handleSearch}
            >
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                    <DatePicker
                        selected={fromDate}
                        onChange={(date) => {setFromDate(date); onSearch(null)}}
                        showMonthYearPicker
                        dateFormat="MMMM yyyy"
                        maxDate={toDate}
                        placeholderText="Select from month and year"
                        className="w-full px-3 py-2 border border-primary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        wrapperClassName="w-full"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <DatePicker
                        selected={toDate}
                        onChange={(date) => {
                            if (date) {
                              const year = date.getFullYear();
                              const month = date.getMonth();
                              const lastDay = new Date(year, month + 1, 0); // Last day of the month
                              lastDay.setHours(23, 59, 59, 999); // Set time to 23:59:59.999
                              setToDate(lastDay);
                            } else {
                              setToDate(null);
                            }
                            onSearch(null)
                          }}
                        showMonthYearPicker
                        dateFormat="MMMM yyyy"
                        placeholderText="Select to month and year"
                        minDate={fromDate}
                        maxDate={new Date()}
                        className="w-full px-3 py-2 border border-primary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        wrapperClassName="w-full"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search Query</label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {setSearchQuery(e.target.value); onSearch(null)}}
                        placeholder="Enter search query"
                        className="w-full px-3 py-2 border border-primary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Search
                </button>
            </form>
        </div>
    );
}

export default SearchComponent;