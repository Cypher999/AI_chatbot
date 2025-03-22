"use client"
import { useState } from "react";
import PasswordInput from "@/components/shared/passwordInput";
import {  Save } from "lucide-react";
import Button from "@/components/ui/button";
import { updatePassword } from "@/utils/services/user/profile";
import Loading from "@/components/shared/loading";
import Swal from "sweetalert2";
export default function FormPassword() {
  const [loading,setLoading]=useState(false);
  const [modalData,setModalData]=useState({
    old:"",
    new: "",
    confirm: "",
  })
  const [error,setError]=useState({
    old:[],
    new: [],
    confirm: [],
  })
  const handleChange=function(e){
    setModalData(n=>({
      ...n,
      [e.target.name]:e.target.value
    }))
  }
  const handleSubmit = async (e) => {
      if(loading) return 0;
      setLoading(true)
      e.preventDefault();
      const fr=new FormData()
      fr.append('old',modalData.old)
      fr.append('new',modalData.new)
      fr.append('confirm',modalData.confirm)
      const res = await updatePassword(fr);
      
      setLoading(false)
      if (res.status=="error") {
        alert(res.message);
      } else if(res.status=="validation error"){
        setError(res.data)
      }else {
        Swal.fire({
          toast: true,
          position: "top-end", // Position to bottom-right
          icon: "success",
          title: res.message,
          showConfirmButton: false,
          timer: 3000, // Auto-close after 3 seconds
          timerProgressBar: true,
          background: "#343a40", // Dark theme
          color: "#fff", // White text
        });
        setModalData({
          old:"",
          new: "",
          confirm: "",
        })
        setError({
          old:[],
          new: [],
          confirm: [],
        })
      }
      
  };
  return (
    <div className="bg-gray-800 p-6 rounded-lg flex flex-col mt-4">
      <h2 className="border-b px-6 pb-4">Update Password</h2>
      <form onSubmit={handleSubmit} className="max-h-96 p-3 overflow-auto flex flex-col">
        <PasswordInput
          name="old"
          placeholder="Old Password"
          onChange={handleChange}
          value={modalData.old}
        />
        {
          error.old
          &&
          error.old.map((item,index)=>(
            <div className="mb-3 text-red-500" key={index}>{item}</div>
          ))
        }
         <PasswordInput
          name="new"
          placeholder="New Password"
          onChange={handleChange}
          value={modalData.new}
        />
        {
          error.new
          &&
          error.new.map((item,index)=>(
            <div className="mb-3 text-red-500" key={index}>{item}</div>
          ))
        }
         <PasswordInput
          name="confirm"
          placeholder="Confirm New Password"
          onChange={handleChange}
          value={modalData.confirm}
        />
        {
          error.confirm
          &&
          error.confirm.map((item,index)=>(
            <div className="mb-3 text-red-500" key={index}>{item}</div>
          ))
        }
       <>
            {
              loading
              ?
              <Loading/>
              :
              <Button outline={true} type="submit" className="mt-3 w-50">
                <Save size={16}/>
                <span className="ml-3">Update Password</span>
              </Button>
            }
          </>
      </form>
    </div>
  );
}