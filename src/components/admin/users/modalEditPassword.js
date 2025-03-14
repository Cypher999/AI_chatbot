"use client"
import { useState } from "react";
import {  Save,  X } from "lucide-react";
import { Modal,Header,Body,Footer } from "@/components/ui/modal";
import PasswordInput from "@/components/shared/passwordInput";
import Button from "@/components/ui/button";
import { updatePassword } from "@/utils/services/admin/users";
import Loading from "@/components/shared/loading";
import Swal from "sweetalert2";
export default function ModalEditPassword({show,setShow,onSubmit,id}) {
  const [loading,setLoading]=useState(false);
  const [modalData,setModalData]=useState({
    password:"",
    confirm:"",
  })
  const [error,setError]=useState({
    password:[],
    confirm:[],
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
      fr.append('password',modalData.password)
      fr.append('confirm',modalData.confirm)
      const result = await updatePassword(id,fr);
      
      setLoading(false)
      if (result.status=="error") {
        alert(result.message);
      } else if(result.status=="validation error"){
        setError(result.data)
      }else {
        Swal.fire({
          toast: true,
          position: "top-end", // Position to bottom-right
          icon: "success",
          title: result.message,
          showConfirmButton: false,
          timer: 3000, // Auto-close after 3 seconds
          timerProgressBar: true,
          background: "#343a40", // Dark theme
          color: "#fff", // White text
        });
        setShow(false)
        setModalData({
          password:"",
          confirm:""
        })
        await onSubmit()
      }
      
    };
  return (
    <Modal show={show}>
      <Header className='flex items-center'>
        <h2 className="text-lg font-bold">Update Password</h2>
        <Button className="text-red" onClick={() => setShow(false)}>
          <X size={16} color="red"/>
        </Button>
      </Header>
      <Body>
        {
            loading
            ?
            <div className="flex justify-center h-10 items-center">
                <Loading/>
            </div>
            :
            <form onSubmit={handleSubmit} className="max-h-96 p-3 overflow-auto flex flex-col">
                   <PasswordInput
                     name="password"
                     placeholder="Password"
                     onChange={handleChange}
                     value={modalData.password}
                   />
                   {
                     error.password
                     &&
                     error.password.map((item,index)=>(
                       <div className="mb-3 text-red-500" key={index}>{item}</div>
                     ))
                   }
                   <PasswordInput
                     name="confirm"
                     placeholder="Confirm Password"
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
          <Button outline={true} type="submit" className="mt-3 w-1/4">
            {
              loading
              ?
              <Loading/>
              :
              <>
                <Save size={16}/>
                <span className="ml-3">Save</span>
              </>
            }
          </Button>
        </form>
        }
      </Body>
    </Modal>
  );
}