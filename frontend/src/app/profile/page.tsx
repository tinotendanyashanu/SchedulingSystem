"use client";

import { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../../_lib/api";
import toast from "react-hot-toast";

export default function ProfilePage() {
    const [user, setUser] = useState<{ username: string; email: string } | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            window.location.href = "/login";
            return;
        }
        setToken(storedToken);
        getUserProfile(storedToken).then(setUser).catch(() => toast.error("Failed to load profile"));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !user) return;
        setLoading(true);
        try {
            await updateUserProfile(user, token);
            toast.success("Profile updated!");
        } catch (err) {
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!token || !user) return null;

    return (
        <div className="max-w-6xl mx-auto py-12">
            <h1 className="text-4xl font-bold text-green-800 mb-8">Your Profile</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={user.username}
                            onChange={e => setUser({ ...user, username: e.target.value })}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={user.email}
                            onChange={e => setUser({ ...user, email: e.target.value })}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
}