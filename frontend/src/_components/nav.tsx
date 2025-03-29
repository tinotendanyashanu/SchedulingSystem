"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/outline";

const NavBar = () => {
    const [token, setToken] = useState<string | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        window.location.href = "/login";
    };

    if (pathname === "/login") return null;

    return (
        <nav className="sticky top-0 bg-white shadow-md p-4 flex justify-between items-center z-10">
            <a href="/" className="text-2xl font-semibold text-green-800">
                UZ Exam Scheduler
            </a>
            <div className="space-x-6 hidden md:flex items-center">
                <a href="/" className="hover:text-yellow-500 transition">Dashboard</a>
                <a href="/courses" className="hover:text-yellow-500 transition">Courses</a>
                <a href="/timetable" className="hover:text-yellow-500 transition">Timetable</a>
                {token && (
                    <>
                        <a href="/profile" className="hover:text-yellow-500 transition flex items-center">
                            <UserIcon className="h-5 w-5 mr-1" /> Profile
                        </a>
                        <button
                            onClick={handleLogout}
                            className="text-blue-600 hover:text-blue-800 transition"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
