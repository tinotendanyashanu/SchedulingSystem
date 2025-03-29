"use client";

import { useState, useEffect } from "react";
import { fetchCourses, fetchFaculty, Course, Faculty } from "../../_lib/api";
import { format } from "date-fns";

export default function Dashboard() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            window.location.href = "/login";
            return;
        }
        setToken(storedToken);
        fetchCourses(storedToken).then(setCourses);
        fetchFaculty(storedToken).then(setFaculty);
    }, []);

    if (!token) return null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-800 to-yellow-500 text-white">
            <div className="max-w-6xl mx-auto py-12">
                <h1 className="text-4xl font-bold mb-8 text-center">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total Courses" value={courses.length} />
                    <StatCard title="Total Faculty" value={faculty.length} />
                    <StatCard title="Timetables Generated" value="3" /> {/* Placeholder */}
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RecentActivity courses={courses.slice(0, 5)} />
                    <CalendarPreview />
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
    return (
        <div className="bg-white text-green-800 p-6 rounded-lg shadow-lg transform transition-all hover:scale-105">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-3xl mt-2">{value}</p>
        </div>
    );
}

function RecentActivity({ courses }: { courses: Course[] }) {
    return (
        <div className="bg-white text-green-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <ul className="space-y-3">
                {courses.map(course => (
                    <li key={course.id} className="flex justify-between">
                        <span>{course.name}</span>
                        <span>{format(new Date(), "MMM d")}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function CalendarPreview() {
    return (
        <div className="bg-white text-green-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Upcoming Exams</h2>
            <div className="text-center text-gray-500">Calendar Preview (TBD)</div>
        </div>
    );
}