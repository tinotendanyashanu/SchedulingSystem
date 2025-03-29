"use client";

import { useState, useEffect } from "react";
import { generateTimetable, TimetableEntry } from "../../_lib/api";
import toast from "react-hot-toast";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 30 },
    table: { display: "flex", width: "auto", borderStyle: "solid", borderWidth: 1, borderColor: "#bfbfbf" },
    tableRow: { flexDirection: "row" },
    tableColHeader: { width: "20%", borderStyle: "solid", borderWidth: 1, borderColor: "#bfbfbf", backgroundColor: "#f0f0f0", padding: 5 },
    tableCol: { width: "20%", borderStyle: "solid", borderWidth: 1, borderColor: "#bfbfbf", padding: 5 },
    text: { fontSize: 10 },
});

export default function TimetablePage() {
    const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<"course_name" | "day_of_week">("course_name");
    const [filterDay, setFilterDay] = useState("");

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            window.location.href = "/login";
            return;
        }
        setToken(storedToken);
    }, []);

    const handleGenerate = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await generateTimetable(token);
            setTimetable(data);
            toast.success("Timetable generated!");
        } catch (err) {
            toast.error("Failed to generate timetable");
        } finally {
            setLoading(false);
        }
    };

    const sortedTimetable = [...timetable].sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    const filteredTimetable = filterDay ? sortedTimetable.filter(t => t.day_of_week === filterDay) : sortedTimetable;

    const exportToPDF = async () => {
        const doc = (
            <Document>
                <Page size="A4" style={styles.page}>
                    <Text style={{ fontSize: 16, marginBottom: 10 }}>Exam Timetable</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableColHeader}><Text style={styles.text}>Course</Text></View>
                            <View style={styles.tableColHeader}><Text style={styles.text}>Classroom</Text></View>
                            <View style={styles.tableColHeader}><Text style={styles.text}>Day</Text></View>
                            <View style={styles.tableColHeader}><Text style={styles.text}>Start</Text></View>
                            <View style={styles.tableColHeader}><Text style={styles.text}>End</Text></View>
                        </View>
                        {filteredTimetable.map(entry => (
                            <View key={entry.id} style={styles.tableRow}>
                                <View style={styles.tableCol}><Text style={styles.text}>{entry.course_name}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.text}>{entry.classroom_name}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.text}>{entry.day_of_week}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.text}>{entry.start_time}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.text}>{entry.end_time}</Text></View>
                            </View>
                        ))}
                    </View>
                </Page>
            </Document>
        );

        const blob = await pdf(doc).toBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "timetable.pdf";
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!token) return null;

    return (
        <div className="max-w-6xl mx-auto py-12">
            <h1 className="text-4xl font-bold text-green-800 mb-8">Your Timetable</h1>
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={handleGenerate}
                    className="bg-yellow-500 text-white px-6 py-3 rounded-full hover:bg-yellow-600 transition disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate Timetable"}
                </button>
                <button
                    onClick={exportToPDF}
                    className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
                    disabled={!timetable.length}
                >
                    Export to PDF
                </button>
            </div>
            <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                    <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
                        Sort By
                    </label>
                    <select
                        id="sort-by"
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value as any)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        <option value="course_name">Sort by Course</option>
                        <option value="day_of_week">Sort by Day</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="filter-day" className="block text-sm font-medium text-gray-700 mb-1">
                        Filter by Day
                    </label>
                    <select
                        id="filter-day"
                        value={filterDay}
                        onChange={e => setFilterDay(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        <option value="">All Days</option>
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                </div>
            </div>
            {filteredTimetable.length > 0 ? (
                <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-6">
                    <table className="w-full">
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
                            {filteredTimetable.map(entry => (
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