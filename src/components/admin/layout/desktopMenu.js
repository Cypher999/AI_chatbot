import { Home as HomeIcon, Users, Bot } from "lucide-react";
import Button from "@/components/ui/button";
import {  useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
export default function DesktopMenu({
    showMenu
}){
    const router=useRouter()
    const pathname = usePathname(); 
    const handleClick=function(dest){
        router.push(dest)
    }
    console.log(pathname)
    return (
        <div className={`hidden md:flex flex-col h-[90vh] overflow-y-auto overflow-x-hidden ${showMenu ? "md:w-2/8 lg:w-1/8" : "md:w-2/16 lg:w-1/16"} transition-all duration-300 ease-in-out bg-gray-800  items-center  px-4 py-4 space-y-3`}>
            <Button outline={true} active={pathname==="/admin"} onClick={()=>{handleClick('/admin')}} className={`w-full ${!showMenu && "justify-center"}`}>
                <HomeIcon size={20} className="" />
                {
                    showMenu && 
                    <span className="ml-3 truncate overflow-hidden whitespace-nowrap">
                    Home
                    </span>
                }
            </Button>
            <Button outline={true} active={pathname==="/admin/agent"} onClick={()=>{handleClick('/admin/agent')}} className={`w-full ${!showMenu && "justify-center"}`}>
                <Bot size={20} className="" />
                {
                    showMenu && 
                    <span className="ml-3 truncate overflow-hidden whitespace-nowrap">
                    AI Agent
                    </span>
                }
            </Button>
            <Button outline={true} active={pathname==="/admin/users"} onClick={()=>{handleClick('/admin/users')}} className={`w-full ${!showMenu && "justify-center"}`}>
                <Users size={20} className="" />
                {
                    showMenu && 
                    <span className="ml-3 truncate overflow-hidden whitespace-nowrap">
                    Users
                    </span>
                }
            </Button>
        </div>
    )
}