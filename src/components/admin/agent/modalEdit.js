"use client"
import { useEffect, useState } from "react";
import Input from "@/components/ui/input";
import { BotIcon, ListTree, Save, Sheet, X } from "lucide-react";
import { Modal,Header,Body,Footer } from "@/components/ui/modal";
import TextArea from "@/components/ui/textArea";
import Button from "@/components/ui/button";
import { getOne,update } from "@/utils/services/admin/agent";
import Loading from "@/components/shared/loading";
import Swal from "sweetalert2";
export default function ModalEdit({show,setShow,onSubmit,id}) {
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
      const result = await update(id,fr);
      
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
          name:"",
          context:"",
          description:""
        })
        await onSubmit()
      }
      
    };
    const fetchData = async () => {
        if(id===null) return 0;
        setLoading(true)
        const result = await getOne(id);
        if(result.status=='error'){
            Swal.fire({
                toast: true,
                position: "top-end", // Position to bottom-right
                icon: "error",
                title: result.message,
                showConfirmButton: false,
                timer: 3000, // Auto-close after 3 seconds
                timerProgressBar: true,
                background: "#343a40", // Dark theme
                color: "#fff", // White text
            });
            setShow(false)
            return 0;
        }
        setModalData(result.data);
        
        setLoading(false)
    };
    useEffect(()=>{
        fetchData()
    },[show,id])
  return (
    <Modal show={show}>
      <Header className='flex items-center'>
        <h2 className="text-lg font-bold">Update AI Agent</h2>
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
          <Input
            name="name"
            label="agent name"
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
            label="context"
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
            label="description"
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
        }
      </Body>
    </Modal>
  );
}