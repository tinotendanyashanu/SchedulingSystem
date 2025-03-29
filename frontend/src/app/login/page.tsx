"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, signup, forgotPassword } from "../../_lib/api";
import { Tab } from "@headlessui/react";
import { classNames } from "../../_lib/utils";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [tabIndex, setTabIndex] = useState(0);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) return toast.error("Please fill all fields");
        setLoading(true);
        try {
            const { access_token } = await login(username, password);
            localStorage.setItem("token", access_token);
            toast.success("Logged in successfully!");
            router.push("/");
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !email || !password) return toast.error("Please fill all fields");
        setLoading(true);
        try {
            await signup(username, email, password);
            toast.success("Signup successful! Please login.");
            setTabIndex(0);
            setUsername("");
            setEmail("");
            setPassword("");
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return toast.error("Please enter your email");
        setLoading(true);
        try {
            const response = await forgotPassword(email);
            toast.success(response.message);
            setEmail("");
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Reset request failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-800 to-yellow-500 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all hover:scale-105">
                <h1 className="text-4xl font-bold text-green-800 mb-8 text-center">UZ Exam Scheduler</h1>
                <Tab.Group selectedIndex={tabIndex} onChange={setTabIndex}>
                    <Tab.List className="flex space-x-1 rounded-lg bg-blue-100 p-1 mb-6">
                        {["Login", "Signup", "Forgot Password"].map((title) => (
                            <Tab
                                key={title}
                                className={({ selected }) =>
                                    classNames(
                                        "w-full py-2.5 text-sm font-medium rounded-lg",
                                        selected ? "bg-blue-600 text-white" : "text-blue-600 hover:bg-blue-200"
                                    )
                                }
                            >
                                {title}
                            </Tab>
                        ))}
                    </Tab.List>
                    <Tab.Panels>
                        <Tab.Panel>
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label htmlFor="username-login" className="block text-sm font-medium text-gray-700">Username</label>
                                    <input
                                        id="username-login"
                                        type="text"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        placeholder="Enter username"
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password-login" className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        id="password-login"
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        disabled={loading}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center"
                                    disabled={loading}
                                >
                                    {loading ? <Spinner /> : "Login"}
                                </button>
                            </form>
                        </Tab.Panel>
                        <Tab.Panel>
                            <form onSubmit={handleSignup} className="space-y-6">
                                <div>
                                    <label htmlFor="username-signup" className="block text-sm font-medium text-gray-700">Username</label>
                                    <input
                                        id="username-signup"
                                        type="text"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        placeholder="Enter username"
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        id="email-signup"
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="Enter email"
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        id="password-signup"
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        disabled={loading}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center"
                                    disabled={loading}
                                >
                                    {loading ? <Spinner /> : "Signup"}
                                </button>
                            </form>
                        </Tab.Panel>
                        <Tab.Panel>
                            <form onSubmit={handleForgotPassword} className="space-y-6">
                                <div>
                                    <label htmlFor="email-forgot" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        id="email-forgot"
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        disabled={loading}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center"
                                    disabled={loading}
                                >
                                    {loading ? <Spinner /> : "Reset Password"}
                                </button>
                            </form>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </div>
    );
}

function Spinner() {
    return <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>;
}