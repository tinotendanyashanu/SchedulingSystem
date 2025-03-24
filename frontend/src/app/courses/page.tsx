"use client";

import { useState, useEffect } from "react";
import { fetchFaculty, createFaculty, fetchCourses, createCourse, Faculty, Course } from "../../_lib/api";

export default function CoursesPage() {
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [form, setForm] = useState<Omit<Course, "id">>({ name: "", department: "", faculty_id: 0 });

    useEffect(() => {
        loadFaculty();
        loadCourses();
    }, []);

    const loadFaculty = async () => setFaculty(await fetchFaculty());
    const loadCourses = async () => setCourses(await fetchCourses());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createCourse(form);
        loadCourses();
        setForm({ name: "", department: "", faculty_id: 0 });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-green-800 mb-6">Manage Courses</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="course-name" className="block text-sm font-medium text-gray-700">
                            Course Name
                        </label>
                        <input
                            id="course-name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            placeholder="Course Name"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                            Department
                        </label>
                        <input
                            id="department"
                            value={form.department}
                            onChange={e => setForm({ ...form, department: e.target.value })}
                            placeholder="Department"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <div>
                        <label htmlFor="faculty-id" className="block text-sm font-medium text-gray-700">
                            Faculty
                        </label>
                        <select
                            id="faculty-id"
                            value={form.faculty_id}
                            onChange={e => setForm({ ...form, faculty_id: parseInt(e.target.value) || 0 })}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                            <option value={0}>Select Faculty</option>
                            {faculty.map(f => (
                                <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                        </select>
                    </div>
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
                        <p>Faculty ID: {course.faculty_id}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}