"use client"
import {  Menu,ChevronDown } from "lucide-react";
import { useState } from "react";
import ProfileMenu from "./profileMenu";
import Button from "@/components/ui/button";
export default function Header({
    setShowMenu
}){
    const [showProfile,setShowProfile]=useState(false);
    return (
        <div className="w-full items-center justify-between flex bg-gray-700 p-4">
            <div className="flex items-center">
                <Button
                onClick={()=>{setShowMenu(n=>!n)}} 
                    outline={true}
                >
                    <Menu size={20}/>
                </Button>
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
                    <ProfileMenu/>
                }
            </div>
        </div>
    )
}