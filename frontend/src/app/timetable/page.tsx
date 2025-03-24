"use client";

import { useState } from "react";
import { generateTimetable, TimetableEntry } from "../../_lib/api";

export default function TimetablePage() {
    const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        const data = await generateTimetable();
        setTimetable(data);
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-green-800 mb-6">Your Timetable</h1>
            <button
                onClick={handleGenerate}
                className="bg-yellow-500 text-white px-6 py-2 rounded-full hover:bg-yellow-600 transition mb-6 disabled:opacity-50"
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate Timetable"}
            </button>
            {timetable.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow-md">
                        <thead className="bg-green-800 text-white">
                            <tr>
                                <th className="p-3">Course</th>
                                <th className="p-3">Classroom</th>
                                <th className="p-3">Day</th>
                                <th className="p-3">Start</th>
                                <th className="p-3">End</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timetable.map(entry => (
                                <tr key={entry.id} className="hover:bg-yellow-100 transition">
                                    <td className="p-3">{entry.course_name}</td>
                                    <td className="p-3">{entry.classroom_name}</td>
                                    <td className="p-3">{entry.day_of_week}</td>
                                    <td className="p-3">{entry.start_time}</td>
                                    <td className="p-3">{entry.end_time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-600">No timetable generated yet.</p>
            )}
        </div>
    );
}