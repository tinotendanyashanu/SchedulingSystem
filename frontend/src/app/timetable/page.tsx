"use client";

import { useState } from "react";
import { generateTimetable, TimetableEntry } from "../../_lib/api";

export default function TimetablePage() {
    const [timetable, setTimetable] = useState<TimetableEntry[]>([]);

    const handleGenerate = async () => setTimetable(await generateTimetable());

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-green-800 mb-6">Your Timetable</h1>
            <button
                onClick={handleGenerate}
                className="bg-yellow-500 text-white px-6 py-2 rounded-full hover:bg-yellow-600 transition mb-6"
            >
                Generate Timetable
            </button>
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
                        {timetable.map((entry, index) => (
                            <tr key={index} className="hover:bg-yellow-100 transition">
                                <td className="p-3">{entry.course}</td>
                                <td className="p-3">{entry.classroom}</td>
                                <td className="p-3">{entry.day}</td>
                                <td className="p-3">{entry.start}</td>
                                <td className="p-3">{entry.end}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}