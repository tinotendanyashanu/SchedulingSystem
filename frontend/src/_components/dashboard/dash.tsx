export default function Dashboard() {
    return (
        <div className=" min-h-screen bg-gradient-to-b from-green-800 to-yellow-500 text-white">
            <div className="text-center py-30">
                <h1 className="text-4xl font-bold">Welcome to Your Exam Scheduler</h1>
                <p className="mt-2 text-lg">Plan smarter, study better</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white text-green-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                    <h2 className="text-xl font-semibold">Add Course</h2>
                    <a href="/courses" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:scale-105 transition">Go</a>
                </div>
                <div className="bg-white text-green-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                    <h2 className="text-xl font-semibold">Generate Timetable</h2>
                    <a href="/timetable" className="mt-4 inline-block bg-yellow-500 text-white px-4 py-2 rounded hover:scale-105 transition">Go</a>
                </div>
                <div className="bg-white text-green-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                    <h2 className="text-xl font-semibold">View Timetable</h2>
                    <a href="/timetable" className="mt-4 inline-block bg-green-800 text-white px-4 py-2 rounded hover:scale-105 transition">Go</a>
                </div>
            </div>
        </div>
    );
}