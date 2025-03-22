"use client"
import { useState,useEffect } from "react";
import Input from "@/components/ui/input";
import {  Save, ImageIcon, User, Edit, XOctagon, } from "lucide-react";
import Button from "@/components/ui/button";
import { updateData,getOne } from "@/utils/services/user/profile";
import Loading from "@/components/shared/loading";
import Swal from "sweetalert2";
export default function FormProfile() {
  const [loading,setLoading]=useState(false);
  const [editMode,setEditMode]=useState(false);
  const [modalData,setModalData]=useState({
    username:"",
    photo: null,
  })
  const [error,setError]=useState({
    username:[],
    photo: [],
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
      console.log(modalData.photo)
      if(modalData.photo) fr.append('photo',modalData.photo)
      const res = await updateData(fr);
      
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

        window.location.reload();
      }
      
  };
  const fetchData = async () => {
    setLoading(true)
    const result = await getOne();
    setModalData(n=>({
      ...result.data,
      ['photo']:null
    }))
    setPreview(`/image/user/${result.data.photo}`)
    setLoading(false)
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="bg-gray-800 p-6 rounded-lg flex flex-col">
      <h2 className="border-b px-6 pb-4">Profile Data</h2>
      <form onSubmit={handleSubmit} className="max-h-96 p-3 overflow-auto flex flex-col">
        <Input
          name="username"
          label="username"
          placeholder="User Name"
          disabled={!editMode}
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
        {/* Image Upload Section */}
        <label className="mt-3 text-sm font-medium text-white">Profile Picture</label>
        {editMode && <div className="flex items-center space-x-3">
          <input name="photo" type="file" accept="image/*" onChange={handleChange} className="hidden" id="upload" />
          <label htmlFor="upload" className="cursor-pointer flex items-center space-x-2 border px-3 py-2 rounded-md shadow-sm bg-gray-700 hover:bg-gray-500 transition">
            <ImageIcon size={16} />
            <span className="ml-3">Select Image</span>
          </label>
        </div>}
        {preview && (
          <div className="mt-3">
            <img src={preview} alt="Preview" className="w-24 h-24 rounded-md shadow-md border object-cover" />
          </div>
        )}

        {error.photo && error.photo.map((item, index) => (
          <div className="mb-3 text-red-500" key={index}>{item}</div>
        ))}
        {
          editMode
          ?
          <div className="flex items-center">
            <>
              {
                loading
                ?
                <Loading/>
                :
                <Button outline={true} type="submit" className="mt-3 w-30">
                <Save size={16}/>
                <span className="ml-3">Save</span>
              </Button>
              }
            </>
           
            <Button outline={true} type="button" onClick={()=>{setEditMode(false)}} className="mt-3 w-30 ml-3">
              <XOctagon size={16}/>
              <span className="ml-3">Cancel</span>
            </Button>
          </div>
          :
          <Button outline={true} type="button" onClick={()=>{setEditMode(true)}} className="mt-3 w-40">
              <Edit size={16}/>
              <span className="ml-3">Edit Profile</span>
            </Button>
        }
      </form>
    </div>
  );
}