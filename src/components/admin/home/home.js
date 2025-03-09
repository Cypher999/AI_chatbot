"use client"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Search, Settings,Home as HomeIcon, Brain, Users } from "lucide-react";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 600 },
  { name: "Mar", value: 800 },
  { name: "Apr", value: 700 },
  { name: "May", value: 1000 },
];

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-900 text-teal-400">
        <aside className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-6">
        <div className="w-10 h-10 bg-gray-700 rounded-full" />
        <div className="border border-1 rounded hover:bg-gray-600  p-2">
            <HomeIcon size={20} className="text-teal-400 cursor-pointer hover:text-teal-300" />
        </div>
        <div className="border border-1 rounded hover:bg-gray-600  p-2">
            <Brain size={20} className="text-teal-400 cursor-pointer hover:text-teal-300" />
        </div>
        <div className="border border-1 rounded hover:bg-gray-600  p-2">
            <Users size={20} className="text-teal-400 cursor-pointer hover:text-teal-300" />
        </div>
        
        
        </aside>


      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Navbar */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-semibold">Dashboard</div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-800 p-2 rounded-lg">
              <Search className="text-gray-500" size={16} />
              <input className="bg-transparent outline-none text-white px-2" placeholder="Search..." />
            </div>
            <Settings className="text-gray-500" size={20} />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Circular Progress (Custom Tailwind) */}
          <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="gray" strokeWidth="8" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="teal"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeDashoffset="188.4"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">25%</span>
            </div>
            <p className="mt-4">Completion Rate</p>
          </div>

          {/* Stats Cards */}
          {["$65,502", "$250,502", "$500,000"].map((amount, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="w-12 h-12 mx-auto bg-teal-400 rounded-full" />
              <h3 className="text-lg mt-4">Lorem Ipsum</h3>
              <p className="text-xl font-bold">{amount}</p>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="bg-gray-800 mt-6 p-6 rounded-lg">
          <h3 className="mb-4">Sales Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <XAxis dataKey="name" stroke="#4FD1C5" />
              <YAxis stroke="#4FD1C5" />
              <Tooltip wrapperStyle={{ backgroundColor: "#222", color: "#fff" }} />
              <Line type="monotone" dataKey="value" stroke="#4FD1C5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
