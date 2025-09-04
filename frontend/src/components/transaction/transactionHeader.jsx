// TransactionSearch.jsx
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function TransactionSearch({ handleSearch, search, setSearch }) {

    return (
        <form
            onSubmit={handleSearch}
            className="bg-white p-4 md:m-2 md:rounded-2xl shadow-lg flex flex-col md:flex-row md:items-end gap-4"
        >
            <div className="flex-1 md:flex-2">
                <label className="text-sm font-medium text-gray-600 block mb-1">
                    From
                </label>
                <DatePicker
                    selected={search.from}
                    onChange={(e) => setSearch({ ...search, from: e })}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                    closeOnScroll={(e) => e.target === document}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    wrapperClassName="w-full"
                    isClearable
                />
            </div>

            {/* To date */}
            <div className="flex-1 md:flex-2">
                <label className="text-sm font-medium text-gray-600 block mb-1">
                    To
                </label>
                <DatePicker
                    selected={search.to}
                    onChange={(e) => setSearch({ ...search, to: e })}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                    minDate={search.from || undefined}
                    closeOnScroll={(e) => e.target === document}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    isClearable
                    wrapperClassName="w-full my-custom-datepicker-wrapper"
                />
            </div>

            {/* Search term with clear icon */}
            <div className="relative flex-1 md:flex-2">
                <div className="relative flex items-center bg-white border border-gray-200 rounded-xl">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search for merchants..."
                            value={search.search}
                            onChange={(e) => setSearch({ ...search, search: e.target.value })}
                            className="w-full px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent transition-all duration-200"
                        />
                        {search.search && (
                            <button
                                type="button"
                                onClick={() => setSearch({ ...search, search: '' })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 bg-white hover:text-gray-600 transition-colors duration-200"
                                aria-label="Clear search"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="ml-2 px-4 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold rounded-r-xl "
                    >
                        Search
                    </button>
                </div>
            </div>
        </form>
    );
}