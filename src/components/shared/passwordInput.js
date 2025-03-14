"use client"
import { Eye, EyeClosed,Lock } from "lucide-react"
import { useState } from "react"
export default function PasswordInput({onChange,name,label,placeholder,required}){
    const [show,setShow]=useState(false);
    const eyeClass="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
    return (
        <div className="relative mb-3">
            {label &&<label>{label}</label>}
            <div className={`"relative ${label ? "mt-3":""}"`}>
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type={show?'text':'password'}
                    placeholder={placeholder}
                    name={name}
                    {...required && required}
                    className="w-full bg-gray-700 text-white rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={onChange}
                />
                <button 
                type="button" 
                className={eyeClass}
                onClick={()=>{setShow(n=>!n)}}>
                    {
                        show
                        ?
                        <EyeClosed  size={20} />
                        :
                        <Eye size={20} />
                    }
                </button>
                
            </div>
        </div>
    )
}