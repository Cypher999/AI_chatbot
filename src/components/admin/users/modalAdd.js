"use client"
import { useState } from "react";
import Input from "@/components/ui/input";
import {  Save, ImageIcon, User, X, LucideUserCheck } from "lucide-react";
import { Modal,Header,Body, } from "@/components/ui/modal";
import Button from "@/components/ui/button";
import { add } from "@/utils/services/admin/users";
import Loading from "@/components/shared/loading";
import Swal from "sweetalert2";
import PasswordInput from "@/components/shared/passwordInput";
import Select from "@/components/ui/select";
export default function ModalAdd({show,setShow,onSubmit}) {
  const [loading,setLoading]=useState(false);
  const [modalData,setModalData]=useState({
    username:"",
    password:"",
    confirm:"",
    role:"user",
    photo: null,
  })
  const [error,setError]=useState({
    username:[],
    password:[],
    confirm:[],
    photo: [],
    role:[]
  })
  const [preview, setPreview] = useState(null);
  const handleChange=function(e){
    console.log(e.target.type)
    if(e.target.type==="file"){
      setModalData(n=>({
        ...n,
        [e.target.name]:e.target.files[0]
      }))
      setPreview(URL.createObjectURL(e.target.files[0]))
    }
    else{
      setModalData(n=>({
        ...n,
        [e.target.name]:e.target.value
      }))
    }
   
  }
  const handleSubmit = async (e) => {
      if(loading) return 0;
      setLoading(true)
      e.preventDefault();
      const fr=new FormData()
      fr.append('username',modalData.username)
      fr.append('password',modalData.password)
      fr.append('confirm',modalData.confirm)
      fr.append('role',modalData.role)
      console.log(modalData.photo)
      if(modalData.photo) fr.append('photo',modalData.photo)
      const res = await add(fr);
      
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
        setShow(false)
        setModalData({
          username:"",
          password:"",
          confirm:"",
          photo:null,
        })
        setPreview(null)
        await onSubmit()
      }
      
    };
  return (
    <Modal show={show}>
      <Header className='flex items-center'>
        <h2 className="text-lg font-bold">Add Users</h2>
        <Button className="text-red" onClick={() => setShow(false)}>
          <X size={16} color="red"/>
        </Button>
      </Header>
      <Body>
        <form onSubmit={handleSubmit} className="max-h-96 p-3 overflow-auto flex flex-col">
          <Input
            name="username"
            placeholder="User Name"
            onChange={handleChange}
            value={modalData.username}
            icon={<User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>}
          />
          {
            error.username
            &&
            error.username.map((item,index)=>(
              <div className="mb-3 text-red-500" key={index}>{item}</div>
            ))
          }
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
          <Select 
          icon={
            <LucideUserCheck size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
          } name="role" onChange={handleChange}>
            <option value="">--Select Role--</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </Select>
          {/* Image Upload Section */}
          <label className="mt-3 text-sm font-medium text-white">Profile Picture</label>
          <div className="flex items-center space-x-3">
            <input name="photo" type="file" accept="image/*" onChange={handleChange} className="hidden" id="upload" />
            <label htmlFor="upload" className="cursor-pointer flex items-center space-x-2 border px-3 py-2 rounded-md shadow-sm bg-gray-700 hover:bg-gray-500 transition">
              <ImageIcon size={16} />
              <span className="ml-3">Select Image</span>
            </label>
          </div>
          
          {/* Image Preview */}
          {preview && (
            <div className="mt-3">
              <img src={preview} alt="Preview" className="w-24 h-24 rounded-md shadow-md border object-cover" />
            </div>
          )}

          {error.photo && error.photo.map((item, index) => (
            <div className="mb-3 text-red-500" key={index}>{item}</div>
          ))}
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
      </Body>
    </Modal>
  );
}