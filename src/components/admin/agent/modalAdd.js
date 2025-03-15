"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/ui/input";
import { BotIcon, ListTree, Save, Sheet, X } from "lucide-react";
import { Modal,Header,Body,Footer } from "@/components/ui/modal";
import TextArea from "@/components/ui/textArea";
import Button from "@/components/ui/button";
import { add } from "@/utils/services/admin/agent";
import Loading from "@/components/shared/loading";
import Swal from "sweetalert2";
export default function ModalAdd({show,setShow,onSubmit}) {
  const [loading,setLoading]=useState(false);
  const [modalData,setModalData]=useState({
    name:"",
    context:"",
    description:""
  })
  const [error,setError]=useState({
    name:[],
    context:[],
    description:[]
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
      fr.append('name',modalData.name)
      fr.append('context',modalData.context)
      fr.append('description',modalData.description)
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
          name:"",
          context:"",
          description:""
        })
        setError({
          name:[],
          context:[],
          description:[]
        })
        await onSubmit()
      }
      
    };
  return (
    <Modal show={show}>
      <Header className='flex items-center'>
        <h2 className="text-lg font-bold">Add AI Agent</h2>
        <Button className="text-red" onClick={() => setShow(false)}>
          <X size={16} color="red"/>
        </Button>
      </Header>
      <Body>
        <form onSubmit={handleSubmit} className="max-h-96 p-3 overflow-auto flex flex-col">
          <Input
            name="name"
            label="Agent name"
            placeholder="Agent Name"
            onChange={handleChange}
            value={modalData.name}
            icon={<BotIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>}
          />
          {
            error.name
            &&
            error.name.map((item,index)=>(
              <div className="mb-3 text-red-500" key={index}>{item}</div>
            ))
          }
          <TextArea
            name="context"
            label="Context"
            placeholder="Context"
            onChange={handleChange}
            value={modalData.context}
            icon={<ListTree size={20} className="absolute left-3 top-5 transform -translate-y-1/2 text-gray-400"/>}
          />
          {
            error.context
            &&
            error.context.map((item,index)=>(
              <div className="mb-3 text-red-500" key={index}>{item}</div>
            ))
          }
          <TextArea
            name="description"
            label="Description"
            placeholder="Agent's Description"
            value={modalData.description}
            onChange={handleChange}
            icon={<Sheet size={20} className="absolute left-3 top-5 transform -translate-y-1/2 text-gray-400"/>}
          />
          {
            error.description
            &&
            error.description.map((item,index)=>(
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
      </Body>
    </Modal>
  );
}