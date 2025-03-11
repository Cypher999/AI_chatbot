"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/ui/input";
import { BotIcon, ListTree, Save, Sheet, X } from "lucide-react";
import { Modal,Header,Body,Footer } from "@/components/ui/modal";
import TextArea from "@/components/ui/textArea";
import Button from "@/components/ui/button";
import { add } from "@/utils/services/admin/agent";
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
      if (res?.error) {
        alert(res.error);
      } else if(res?.validation_error){
        setError(res?.validation_error)
      }else {
        alert(res.message)
        setShow(false)
        setModalData({
          name:"",
          context:"",
          description:""
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
          <Button type="submit" className="mt-3 w-1/4">
            {
              loading
              ?
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
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