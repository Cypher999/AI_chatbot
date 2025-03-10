"use client"
import {  Menu,ChevronDown,User,LogOut } from "lucide-react";
import { useState } from "react";
export default function Header({
    setShowMenu
}){
    const [showProfile,setShowProfile]=useState(false);
    return (
        <div className="w-full items-center justify-between flex bg-gray-700 p-4">
            <div className="flex items-center">
                <div onClick={()=>{setShowMenu(n=>!n)}} className="hidden md:block border border-1 rounded hover:bg-gray-600 p-2 text-teal-400 cursor-pointer hover:text-teal-300">
                    <Menu size={20}/>
                </div>
                <div className="text-lg font-semibold ml-4">Admin Panel</div>
            </div>
            <div className="relative">
                <div onClick={()=>{setShowProfile(n=>!n)}} className="flex items-center cursor-pointer space-x-2">
                    <img src="/profile.jpg" alt="Profile" className="w-10 h-10 rounded-full border border-gray-600" />
                    <ChevronDown size={16} className="text-teal-400" />
                </div>

                {
                    showProfile 
                    &&
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
                }
            </div>
        </div>
    )
}