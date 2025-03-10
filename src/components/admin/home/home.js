"use client"
import { Users, BotIcon, ListCheck, } from "lucide-react";
export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gray-800 p-6 rounded-lg flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-4 border-b">Agent</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BotIcon size={60} className="text-white" />
          </div>
          <p className="text-xl font-bold text-white">10</p>
        </div>
        <button className="mt-4 bg-teal-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-teal-400">
          Detail
        </button>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-4 border-b">Knowledge</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ListCheck size={60} className="text-white" />
          </div>
          <p className="text-xl font-bold text-white">10</p>
        </div>
        <button className="mt-4 bg-teal-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-teal-400">
          Detail
        </button>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-4 border-b">User</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users size={60} className="text-white" />
          </div>
          <p className="text-xl font-bold text-white">10</p>
        </div>
        <button className="mt-4 bg-teal-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-teal-400">
          Detail
        </button>
      </div>
    </div>
    
  );
}
