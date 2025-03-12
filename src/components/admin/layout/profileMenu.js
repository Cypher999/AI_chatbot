import { User,LogOut } from "lucide-react"
export default function ProfileMenu(){
    return (
        <div className="absolute right-0 mt-2 w-40 bg-gray-700 shadow-xl rounded-lg overflow-hidden">
            <div className="p-2 hover:bg-gray-600 flex items-center cursor-pointer">
                <User size={16} className="mr-2 text-teal-400" />
                <span>Profile</span>
            </div>
            <div className="p-2 hover:bg-gray-600 flex items-center cursor-pointer">
                <LogOut size={16} className="mr-2 text-red-400" />
                <span className="text-red-400">Logout</span>
            </div>
        </div>
    )
}