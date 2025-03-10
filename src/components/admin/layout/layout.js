"use client"
import {  Users, BotIcon, ListCheck, } from "lucide-react";
import { useState } from "react";
import DesktopMenu from "./desktopMenu";
import MobileMenu from "./mobileMenu";
import Header from "./header";
export default function Layout({children}) {
  const [showMenu,setShowMenu]=useState(true);
  return (
  <div className="min-h-screen h-full bg-gray-900 text-teal-400">
    <Header setShowMenu={setShowMenu}/>
    <div className="w-full flex">
      <DesktopMenu showMenu={showMenu}/>
      <div className={`w-full h-[80vh] md:h-[90vh] overflow-auto ${showMenu ? "md:w-6/8 lg:w-7/8" : "md:w-14/16 lg:w-15/16"} transition-all duration-300 ease-in-out p-8`}>
        {children}
      </div>
    </div>
    <MobileMenu/>
  </div>
    
  );
}
