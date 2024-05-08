'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Layout({ children }) {
    const router = useRouter();
    const [username, setUsername] = useState("");

    function newLine() {
        router.push("/dashboard/addLine");
    }

    function newJob() {
        router.push("/dashboard/addJob");
    }

    function logout() {
        localStorage.removeItem("user-data");
        router.push("/login");
    }

    useEffect(() => {
        // Check if user data is present in localStorage
        const userData = localStorage.getItem("user-data");
        if (!userData) {
            // If not logged in, redirect to login page
            router.push("/login");
        } else {
            // Parse user data and set username
            const { username } = JSON.parse(userData);
            setUsername(username);
        }
    }, []);

    return (
        <div className="flex flex-col w-screen h-screen">
            {/* Dashboard Header */}
            <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold cursor-pointer" onClick={() => router.push("/dashboard")}>Dashboard</h1>
                <div className="flex gap-4 items-center">
                    <div className="flex gap-2 items-center">
                        <span className="text-sm">Logged in as:</span>
                        <span className="text-sm font-semibold">{username}</span>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white" onClick={newLine}>Add new Line</button>
                        <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white" onClick={newJob}>Add new job</button>
                        <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white" onClick={logout}>Logout</button>
                    </div>
                </div>
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">{children}</div> {/* Added overflow-y-auto to make child content scrollable */}
        </div>
    );
}
