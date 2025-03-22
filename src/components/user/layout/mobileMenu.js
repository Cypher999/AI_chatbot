import { Home as HomeIcon, Users, Bot, UserCheck,} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
export default function MobileMenu(){
    const router=useRouter()
    const handleClick=function(dest){
        router.push(dest)
    }
    const pathname = usePathname(); 
    return (
        <nav className="fixed bottom-0 left-0 w-full bg-gray-800 flex justify-around items-center p-3 md:hidden">
            <div onClick={()=>{handleClick('/user')}} className={`flex flex-col items-center ${pathname==="/user"?"text-white":"text-teal-400"} cursor-pointer hover:text-teal-600`}>
                <HomeIcon size={24} />
                <span className="text-xs mt-1">Home</span>
            </div>
            <div onClick={()=>{handleClick('/user/agent')}} className={`flex flex-col items-center  ${pathname==="/user/agent"?"text-white":"text-teal-400"} cursor-pointer hover:text-teal-600`}>
                <Bot size={24} />
                <span className="text-xs mt-1">AI Agent</span>
            </div>
        </nav>
    )
}