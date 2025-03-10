import { Home as HomeIcon, Users, Bot } from "lucide-react";
import Button from "@/components/ui/button";
export default function DesktopMenu({
    showMenu
}){
    return (
        <div className={`hidden md:flex flex-col h-[90vh] overflow-y-auto overflow-x-hidden ${showMenu ? "md:w-2/8 lg:w-1/8" : "md:w-2/16 lg:w-1/16"} transition-all duration-300 ease-in-out bg-gray-800  items-center  px-4 py-4 space-y-3`}>
            <Button className={`w-full ${!showMenu && "justify-center"}`}>
                <HomeIcon size={20} className="" />
                {
                    showMenu && 
                    <span className="ml-3">
                    Home
                    </span>
                }
            </Button>
            <Button className={`w-full ${!showMenu && "justify-center"}`}>
                <Bot size={20} className="" />
                {
                    showMenu && 
                    <span className="ml-3">
                    AI Agent
                    </span>
                }
            </Button>
            <Button className={`w-full ${!showMenu && "justify-center"}`}>
                <Users size={20} className="" />
                {
                    showMenu && 
                    <span className="ml-3">
                    User
                    </span>
                }
            </Button>
        </div>
    )
}