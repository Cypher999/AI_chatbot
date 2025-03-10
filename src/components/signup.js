"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Input from "./ui/input";
import PasswordInput from "./shared/passwordInput";
import { User } from "lucide-react";
export default function Signup() {
  const [form, setForm] = useState({ name: "",password: "",confirm:"" })
  const [error, setError] = useState("")
  const router = useRouter()
  const handleForm=function(e){
    setForm(n=>({
        ...n,
        [e.target.name]:e.target.value
    }))
}
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    const fr=new FormData();
    fr.append('username',form.name)
    fr.append('password',form.password)
    fr.append('confirm',form.confirm)
    const res=await axios.post("/api/auth/register",fr,{
      headers:{ "Content-Type": "multipart/form-data" }
  })
    console.log(res)
    if (res.status==200) {
      router.push("/login")
    } else {
      console.log(res)
      // setError(data.error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-white">
            <h1 className="text-2xl font-bold text-center">Signup</h1>
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <Input
                    icon={<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />}
                    name="name"
                    placeholder="enter username"
                    type="text"
                    required
                    onChange={handleForm}
                />
                <PasswordInput
                    name="password"
                    placeholder="enter your password"
                    required
                    onChange={handleForm}
                />
                <PasswordInput
                    name="confirm"
                    placeholder="confirm your password"
                    required
                    onChange={handleForm}
                />

                {/* Submit Button */}
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold transition">
                  Sign Up
                </button>
            </form>
        </div>
    </div>
  )
}