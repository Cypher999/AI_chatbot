"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react";
import { User } from "lucide-react"
import Input from "./ui/input";
import PasswordInput from "./shared/passwordInput";
export default function Login() {
  const [form, setForm] = useState({ name: "",password: ""})
  const [error, setError] = useState("")
  const router = useRouter()
    const handleForm=function(e){
        setForm(n=>({
            ...n,
            [e.target.name]:e.target.value
        }))
    }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      username: form.name,
      password: form.password,
      redirect: false, // Prevent automatic redirection
    });

    if (res?.error) {
      setError("Invalid username or password");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-white">
            <h1 className="text-2xl font-bold text-center">Login</h1>
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {/* Username Input */}
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

                {/* Submit Button */}
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold transition">
                Sign In
                </button>
            </form>
        </div>
    </div>
  )
}