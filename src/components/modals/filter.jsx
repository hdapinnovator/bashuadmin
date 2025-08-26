import React, { useState } from "react";
import titles from '../../data/titles'




export default function Filter({ setShowFilter, byTitle }) {


    const handleFilter = (title) => {
        byTitle(title)
        setShowFilter(false);
    };


    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowFilter(false);
        }
    };



    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <button
                onClick={() => setShowFilter(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
                Open Filter Modal
            </button>

            <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                onClick={handleOverlayClick}
            >
                <div className="bg-white rounded-2xl shadow-lg w-80 max-h-[70vh] flex flex-col">
                    {/* Header */}
                    <div className="px-4 py-3 bg-blue-600 text-white text-lg font-semibold flex justify-between items-center rounded-t-2xl">
                        Filter Sticks
                        <button
                            onClick={() => setShowFilter(false)}
                            className="text-white hover:text-gray-200 text-xl"
                        >
                            ×
                        </button>
                    </div>

                    {/* Scrollable List */}
                    <div className="p-4 space-y-3 overflow-y-auto">
                        {titles.map((val) => (
                            <button
                                key={val.id}
                                onClick={() => handleFilter(val.name)}
                                className="w-full px-4 py-2 bg-gray-100 rounded-lg text-gray-800 hover:bg-blue-100 hover:text-blue-700 text-left"
                            >
                                {val.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}