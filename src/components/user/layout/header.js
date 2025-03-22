"use client"
import {  Menu,ChevronDown } from "lucide-react";
import { useState,useEffect } from "react";
import ProfileMenu from "./profileMenu";
import Button from "@/components/ui/button";
import { getOne } from "@/utils/services/user/profile";
import Loading from "@/components/shared/loading";
export default function Header({
    setShowMenu
}){
    const [showProfile,setShowProfile]=useState(false);
    const [loading,setLoading]=useState(false);
    const [profileData,setProfileData]=useState({
        username:"",
        photo:""
    });
    const fetchData = async () => {
        setLoading(true)
        const result = await getOne();
        console.log(result)
        setProfileData(result.data)
        setLoading(false)
      };
      useEffect(() => {
        fetchData();
      }, []);
    return (
        <div className="w-full items-center justify-between flex bg-gray-700 p-4">
            <div className="flex items-center">
                <Button
                className="hidden md:block"
                onClick={()=>{setShowMenu(n=>!n)}} 
                    outline={true}
                >
                    <Menu size={20}/>
                </Button>
                <div className="text-lg font-semibold ml-4">Member Area</div>
            </div>
            <div className="relative">
                {
                    loading
                    ?
                    <Loading/>
                    :
                    <>
                    <div onClick={()=>{setShowProfile(n=>!n)}} className="flex items-center cursor-pointer space-x-2">
                        <img src={`/image/user/${profileData.photo}`} alt="Profile" className="w-10 h-10 rounded-full border border-gray-600" />
                        <span className="hidden md:block">{profileData.username}</span>
                        <ChevronDown size={16} className="text-teal-400" />
                    </div>

                {
                    showProfile 
                    &&
                    <ProfileMenu/>
                }
                    </>
                }
            </div>
        </div>
    )
}