import { Home as HomeIcon, Users, Bot, UserCheck,} from "lucide-react";
export default function MobileMenu(){
    return (
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
        </nav>
    )
}