"use client";

import { useState, useEffect } from "react";
import { fetchFaculty, createCourse, fetchCourses, Faculty, Course } from "../../_lib/api";
import toast from "react-hot-toast";

export default function CoursesPage() {
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [form, setForm] = useState<Omit<Course, "id">>({ name: "", department: "", faculty_id: 0 });
    const [search, setSearch] = useState("");
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            window.location.href = "/login";
            return;
        }
        setToken(storedToken);
        loadFaculty(storedToken);
        loadCourses(storedToken);
    }, []);

    const loadFaculty = async (token: string) => setFaculty(await fetchFaculty(token));
    const loadCourses = async (token: string) => setCourses(await fetchCourses(token));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !form.name || !form.department || !form.faculty_id) return toast.error("Please fill all fields");
        await createCourse(form, token);
        toast.success("Course added!");
        loadCourses(token);
        setForm({ name: "", department: "", faculty_id: 0 });
    };

    const filteredCourses = courses.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.department.toLowerCase().includes(search.toLowerCase())
    );

    if (!token) return null;

    return (
        <div className="max-w-6xl mx-auto py-12">
            <h1 className="text-4xl font-bold text-green-800 mb-8">Manage Courses</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="course-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Course Name
                        </label>
                        <input
                            id="course-name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            placeholder="Course Name"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                            Department
                        </label>
                        <input
                            id="department"
                            value={form.department}
                            onChange={e => setForm({ ...form, department: e.target.value })}
                            placeholder="Department"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <div>
                        <label htmlFor="faculty-id" className="block text-sm font-medium text-gray-700 mb-1">
                            Faculty
                        </label>
                        <select
                            id="faculty-id"
                            value={form.faculty_id}
                            onChange={e => setForm({ ...form, faculty_id: parseInt(e.target.value) || 0 })}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                            <option value={0}>Select Faculty</option>
                            {faculty.map(f => (
                                <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition md:mt-6">
                        Add Course
                    </button>
                </form>
            </div>
            <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="w-full p-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                    <div key={course.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                        <h3 className="text-lg font-semibold text-green-800">{course.name}</h3>
                        <p>{course.department}</p>
                        <p>Faculty ID: {course.faculty_id}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}