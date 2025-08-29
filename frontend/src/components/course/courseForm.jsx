import { useState, useEffect } from "react";
import Alert from "../ui/showStatus";
// Helper function to convert 24-hour time to 12-hour format with AM/PM
const convertTo12HourFormat = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const meridiem = hour >= 12 ? 'PM' : 'AM';
    const twelveHour = hour % 12 || 12;
    return `${twelveHour}:${minutes} ${meridiem}`;
};

export default function CourseForm({ initialData, onSubmit, resetTrigger }) {
    /* ------------------ Local State ------------------ */
    const [name, setName] = useState("");
    const [fee, setFee] = useState("");
    const [timeSlots, setTimeSlots] = useState([]);
    const [currentTime, setCurrentTime] = useState("");
    const [timeError, setTimeError] = useState("");

    /* ------------------ Effects ------------------ */
    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setFee(initialData.fee);
            setTimeSlots(initialData.time || []);
        }
    }, [initialData]);

    // Reset form when resetTrigger changes
    useEffect(() => {
        if (resetTrigger) {
            setName("");
            setFee("");
            setTimeSlots([]);
            setCurrentTime("");
            setTimeError("");
        }
    }, [resetTrigger]);

    /* ------------------ Handlers ------------------ */
    const canAddTime = currentTime.trim() !== "";

    const addTimeSlot = () => {
        if (!canAddTime) return;

        const formattedTime = convertTo12HourFormat(currentTime);

        if (timeSlots.includes(formattedTime)) {
            setTimeError("Time already added");
            return;
        }

        setTimeSlots(prev => [...prev, formattedTime]);
        setCurrentTime("");
        setTimeError("");
    };

    const removeTimeSlot = (index) => {
        setTimeSlots(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!timeSlots.length) {
            setTimeError("Time is required");
            return;
        }
        onSubmit({ name, fee, time: timeSlots });
    };

    /* ------------------ UI ------------------ */
    return (
        <form onSubmit={handleSubmit} className="max-w-[600px] mx-3 md:mx-auto mt-10 bgGlass p-8 rounded-lg shadow-md space-y-6">
            <h1 className="text-2xl font-semibold text-slate-800">
                {initialData ? "Edit Course" : "Add New Course"}
            </h1>

            {/* Course Name */}
            <div>
                <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
                    Course Name
                </label>
                <input
                    id="courseName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-primary rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                />
            </div>
            {/* Fee */}
            <div>
                <label htmlFor="courseFee" className="block text-sm font-medium text-gray-700 mb-1">
                    Fee
                </label>
                <input
                    id="courseFee"
                    type="text"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    className="w-full border border-primary rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                />
            </div>


            {/* Time Slot Builder */}
            <div>
                <label htmlFor="courseTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Time
                </label>
                <div className="flex gap-2 items-center">
                    <input
                        id="courseTime"
                        type="time"
                        value={currentTime}
                        onChange={(e) => setCurrentTime(e.target.value)}
                        className="border border-primary rounded-md px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        type="button"
                        disabled={!canAddTime}
                        onClick={addTimeSlot}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                    >
                        Add
                    </button>
                </div>
                {timeError && <p className="text-red-500 text-xs mt-1">{timeError}</p>}
            </div>

            {/* Display Added Slots */}
            {timeSlots.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Added Time Slots:</h3>
                    <ul className="space-y-2 grid grid-cols-2 gap-2">
                        {timeSlots.map((time, index) => (
                            <li
                                key={index}
                                className="flex items-center h-full justify-between bg-white/50 px-4 py-2 rounded-md border border-primary"
                            >
                                <span className="text-gray-800">{time}</span>
                                <button
                                    type="button"
                                    onClick={() => removeTimeSlot(index)}
                                    className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1"
                                    aria-label="Remove time slot"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}



            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none transition-colors"
            >
                {initialData ? "Update Course" : "Create Course"}
            </button>
        </form>
    );
}