'use client'
import { useState } from "react";
import { RiskCategory } from "@/constant/RiskCategory";

export default function FormReportModal({ 
    closeModal, 
    riskPoint,
    locationName, 
    description,
    setDescription, 
    submitHandler,
    reporting, 
    setReporting 
}) {
    return (
        <div
        className="fixed z-100 bg-neutral-900/70 w-full h-screen flex flex-col items-center justify-center"
        >
            <form
            onSubmit={(e) => submitHandler(e)}
            className="flex flex-col rounded-3xl bg-neutral-900/50 border border-white/20 backdrop-blur-xs items-stretch justify-center gap-5 p-6 transition-all duration-300 ease-in-out w-1/3"
            >
                {/* Form Header */}
                <div
                className="flex flex-row items-center justify-between p-2"
                >
                    <h1
                    className="text-3xl font-bold"
                    >
                        Report
                    </h1>
                    
                </div>
                {/* Form */}
                <div
                className="flex flex-col items-center justify-between p-2 gap-5"
                >
                    <div
                    className="flex flex-row items-center justify-between w-full gap-5"
                    >
                        <div
                        className="flex flex-col items-left justify-left w-full gap-1"
                        >
                            <label
                            className="text-white pl-1 text-xl"
                            >
                                Latitude
                            </label>
                            <input 
                            type="text" 
                            value={riskPoint.lat}
                            readOnly
                            className="w-full rounded-xl bg-neutral-900/50 border border-white/20 p-2"
                            />
                        </div>
                        <div
                        className="flex flex-col items-left justify-left w-full gap-1"
                        >
                            <label
                            className="text-white pl-1 text-xl"
                            >
                                Longitude
                            </label>
                            <input 
                            type="text" 
                            value={riskPoint.lng}
                            readOnly
                            className="w-full rounded-xl bg-neutral-900/50 border border-white/20 p-2"
                            />
                        </div>
                    </div>
                    <div
                    className="flex flex-col items-left justify-left w-full gap-1"
                    >
                        <label
                        className="text-white pl-1 text-xl"
                        >
                            Location
                        </label>
                        <input 
                        type="text" 
                        value={locationName}
                        readOnly
                        className="w-full rounded-xl bg-neutral-900/50 border border-white/20 p-2"
                        />
                    </div>
                    <div
                    className="flex flex-col items-left justify-left w-full gap-1"
                    >
                        <label
                        htmlFor="category"
                        className="text-white pl-1 text-xl"
                        >
                            Category
                        </label>
                        <select 
                        name="category" 
                        id="category"
                        className="w-full rounded-xl bg-neutral-900/50 border border-white/20 p-2"
                        >
                            {
                                RiskCategory.map((category) => (
                                    <option 
                                    key={category}
                                    value={category}
                                    >
                                        {category}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div
                    className="flex flex-col items-left justify-left w-full gap-1"
                    >
                        <label
                        className="text-white pl-1 text-xl"
                        >
                            Description
                        </label>
                        <input 
                        type="text" 
                        value={description}
                        placeholder="Describe the situation..."
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full rounded-xl bg-neutral-900/50 border border-white/20 p-2"
                        />
                    </div>
                </div>
                {/* Submit Button */}
                <div
                className="flex flex-row items-center justify-end p-2 gap-3"
                >
                    <button
                    className="flex items-center justify-center bg-neutral-900/60 rounded-full p-2 px-4 hover:bg-red-900/50 transition-all duration-300 ease-in-out"
                    onClick={closeModal}
                    >
                        Cancel
                    </button>
                    <button
                    type="submit"
                    className="flex items-center justify-center bg-red-800/60 rounded-full p-2 px-4 hover:bg-red-700/50 transition-all duration-300 ease-in-out"
                    >
                        Report
                    </button>
                </div>
            </form>
        </div>
    )
}