"use client";

import { useState, useEffect } from "react";
import { fetchCourses, createCourse, Course } from "../../_lib/api";

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [form, setForm] = useState<Omit<Course, "id">>({ name: "", department: "", faculty_id: "" });

    useEffect(() => { loadCourses(); }, []);

    const loadCourses = async () => setCourses(await fetchCourses());
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createCourse(form);
        loadCourses();
        setForm({ name: "", department: "", faculty_id:"" });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-green-800 mb-6">Manage Courses</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Course Name"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                        value={form.department}
                        onChange={e => setForm({ ...form, department: e.target.value })}
                        placeholder="Department"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                        value={form.faculty_id}
                        onChange={e => setForm({ ...form, faculty_id: e.target.value })}
                        placeholder="Faculty ID"
                        // type="number"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                        Add Course
                    </button>
                </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {courses.map(course => (
                    <div key={course.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
                        <h3 className="text-lg font-semibold">{course.name}</h3>
                        <p>{course.department}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}