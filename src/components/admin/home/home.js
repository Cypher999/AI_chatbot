"use client"
import { Home as HomeIcon, Users, Bot, UserCheck, BotIcon, ListCheck, Menu,ChevronDown,User,LogOut } from "lucide-react";
import { useState } from "react";


export default function Home() {
  const [showMenu,setShowMenu]=useState(true);
  return (
  <div className="min-h-screen h-full bg-gray-900 text-teal-400">
    <div className="w-full items-center justify-between flex bg-gray-800 p-4">
      <div className="flex items-center">
        <div onClick={()=>{setShowMenu(n=>!n)}} className="hidden md:block border border-1 rounded hover:bg-gray-600 p-2 text-teal-400 cursor-pointer hover:text-teal-300">
        <Menu size={20}/>
        </div>
        <div className="text-lg font-semibold ml-4">Admin Panel</div>
      </div>
      <div className="relative">
        <div className="flex items-center cursor-pointer space-x-2">
          <img src="/profile.jpg" alt="Profile" className="w-10 h-10 rounded-full border border-gray-600" />
          <ChevronDown size={16} className="text-teal-400" />
        </div>

          <div className="absolute right-0 mt-2 w-40 bg-gray-700 shadow-lg rounded-lg overflow-hidden">
            <div className="p-2 hover:bg-gray-600 flex items-center cursor-pointer">
              <User size={16} className="mr-2 text-teal-400" />
              <span>Profile</span>
            </div>
            <div className="p-2 hover:bg-gray-600 flex items-center cursor-pointer">
              <LogOut size={16} className="mr-2 text-red-400" />
              <span className="text-red-400">Logout</span>
            </div>
          </div>
      </div>
    </div>
    <div className="w-full flex">
      <div className={`hidden md:flex flex-col h-[90vh] overflow-y-auto overflow-x-hidden ${showMenu ? "md:w-2/8 lg:w-1/8" : "md:w-2/16 lg:w-1/16"} transition-all duration-300 ease-in-out bg-gray-800  items-center  px-4 py-4 space-y-3`}>
        <div className={`w-full mx-3 relative flex group border border-1 ${!showMenu && "justify-center"} rounded hover:bg-gray-600 p-2 text-teal-400 cursor-pointer hover:text-teal-300`}>
          <HomeIcon size={20} className="" />
          {
            showMenu && 
            <span className="ml-3">
              Home
            </span>
          }
          
        </div>
        <div className={`w-full mx-3 whitespace-nowrap relative flex group border border-1 ${!showMenu && "justify-center"} rounded hover:bg-gray-600 p-2 text-teal-400 cursor-pointer hover:text-teal-300`}>
          <Bot size={20} className="" />
          {
            showMenu && 
            <span className="ml-3">
              AI Agent
            </span>
          }
          
        </div>
        <div className={`w-full mx-3 relative flex group border border-1 ${!showMenu && "justify-center"} rounded hover:bg-gray-600 p-2 text-teal-400 cursor-pointer hover:text-teal-300`}>
          <Users size={20} className="" />
          {
            showMenu && 
            <span className="ml-3">
              User
            </span>
          }
        </div>
      </div>
      <div className={`w-full h-[80vh] md:h-[90vh] overflow-auto ${showMenu ? "md:w-6/8 lg:w-7/8" : "md:w-14/16 lg:w-15/16"} transition-all duration-300 ease-in-out p-8`}>
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
      </div>
    </div>
    <nav className="fixed bottom-0 left-0 w-full bg-gray-800 flex justify-around items-center p-3 md:hidden">
        <div className="flex flex-col items-center text-teal-400 cursor-pointer hover:text-teal-600">
          <HomeIcon size={24} />
          <span className="text-xs mt-1">Home</span>
        </div>
        <div className="flex flex-col items-center text-teal-400 cursor-pointer hover:text-teal-600">
          <Bot size={24} />
          <span className="text-xs mt-1">AI Agent</span>
        </div>
        <div className="flex flex-col items-center text-teal-400 cursor-pointer hover:text-teal-600">
          <Users size={24} />
          <span className="text-xs mt-1">User</span>
        </div>
        <div className="flex flex-col items-center text-teal-400 cursor-pointer hover:text-teal-600">
          <UserCheck size={24} />
          <span className="text-xs mt-1">Profile</span>
        </div>
      </nav>
  </div>
    
  );
}
