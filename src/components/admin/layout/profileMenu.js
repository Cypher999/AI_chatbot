"use client"
import { User,LogOut } from "lucide-react"
import {  useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { signOut } from "next-auth/react";
export default function ProfileMenu(){
    const handleLogout=async function(){
        Swal.fire({
          title: "Logout",
          text: `are you sure you want to logout ? note : you need to re-login`,
          icon:'question',
          background: "var(--color-gray-800)",
          color: "#fff",
          showCancelButton: true,
          confirmButtonText: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"></path></svg> <span class="ml-3">Yes</span>`,
          cancelButtonText: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg> <span class="ml-3">Cancel</span>`,
          buttonsStyling: false,
          customClass: {
            confirmButton: 'relative flex items-center border border-1 rounded p-2 cursor-pointer transition border-green-600 text-green-600 hover:bg-green-600 hover:text-white  px-3 py-1 mx-2',
            cancelButton: 'relative flex items-center border border-1 rounded p-2 cursor-pointer transition border-red-600 text-red-600 hover:bg-red-600 hover:text-white  px-3 py-1 mx-2'
          },
      }).then(async (e) => {
          if(e.isConfirmed){
              signOut({
                callbackUrl: "/",
              })
              
          }
    
      })
      }
    const router=useRouter();
    return (
        <div className="absolute right-0 mt-2 w-40 bg-gray-700 shadow-xl rounded-lg overflow-hidden">
            <div onClick={()=>{router.push('/admin/profile')}} className="p-2 hover:bg-gray-600 flex items-center cursor-pointer">
                <User size={16} className="mr-2 text-teal-400" />
                <span>Profile</span>
            </div>
            <div onClick={()=>{handleLogout()}} className="p-2 hover:bg-gray-600 flex items-center cursor-pointer">
                <LogOut size={16} className="mr-2 text-red-400" />
                <span className="text-red-400">Logout</span>
            </div>
        </div>
    )
}