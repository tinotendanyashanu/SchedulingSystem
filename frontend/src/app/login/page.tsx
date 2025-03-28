"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, signup, forgotPassword } from "../../_lib/api";

export default function LoginPage() {
    const [tab, setTab] = useState<"login" | "signup" | "forgot">("login");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const { access_token } = await login(username, password);
            localStorage.setItem("token", access_token);
            router.push("/");
        } catch (err: any) {
            setMessage(err.response?.data?.detail || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            await signup(username, email, password);
            setMessage("Signup successful! Please login.");
            setTab("login");
            setUsername("");
            setEmail("");
            setPassword("");
        } catch (err: any) {
            setMessage(err.response?.data?.detail || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const response = await forgotPassword(email);
            setMessage(response.message);
            setEmail("");
        } catch (err: any) {
            setMessage(err.response?.data?.detail || "Reset request failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-800 to-yellow-500 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
                    {tab === "login" ? "Login" : tab === "signup" ? "Signup" : "Forgot Password"}
                </h1>
                <div className="flex justify-around mb-6">
                    <button
                        onClick={() => setTab("login")}
                        className={`px-4 py-2 ${tab === "login" ? "bg-blue-600 text-white" : "text-blue-600"} rounded hover:bg-blue-700 hover:text-white transition`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setTab("signup")}
                        className={`px-4 py-2 ${tab === "signup" ? "bg-blue-600 text-white" : "text-blue-600"} rounded hover:bg-blue-700 hover:text-white transition`}
                    >
                        Signup
                    </button>
                    <button
                        onClick={() => setTab("forgot")}
                        className={`px-4 py-2 ${tab === "forgot" ? "bg-blue-600 text-white" : "text-blue-600"} rounded hover:bg-blue-700 hover:text-white transition`}
                    >
                        Forgot Password
                    </button>
                </div>

                {tab === "login" && (
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="username-login" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="username-login"
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Enter username"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="password-login" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password-login"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                disabled={loading}
                            />
                        </div>
                        {message && <p className="text-red-500 text-sm">{message}</p>}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                )}

                {tab === "signup" && (
                    <form onSubmit={handleSignup} className="space-y-6">
                        <div>
                            <label htmlFor="username-signup" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="username-signup"
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Enter username"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email-signup"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Enter email"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password-signup"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                disabled={loading}
                            />
                        </div>
                        {message && <p className={message.includes("successful") ? "text-green-500" : "text-red-500"} text-sm>{message}</p>}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Signing up..." : "Signup"}
                        </button>
                    </form>
                )}

                {tab === "forgot" && (
                    <form onSubmit={handleForgotPassword} className="space-y-6">
                        <div>
                            <label htmlFor="email-forgot" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email-forgot"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                disabled={loading}
                            />
                        </div>
                        {message && <p className={message.includes("sent") ? "text-green-500" : "text-red-500"} text-sm>{message}</p>}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Reset Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}