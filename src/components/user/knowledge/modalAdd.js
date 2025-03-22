"use client"
import { useState } from "react";
import Input from "@/components/ui/input";
import { CircuitBoard, Notebook, Save, X } from "lucide-react";
import { Modal,Header,Body } from "@/components/ui/modal";
import TextArea from "@/components/ui/textArea";
import Button from "@/components/ui/button";
import { add } from "@/utils/services/user/knowledge";
import Loading from "@/components/shared/loading";
import Swal from "sweetalert2";
export default function ModalAdd({show,setShow,onSubmit,agentId}) {
  const [loading,setLoading]=useState(false);
  const [modalData,setModalData]=useState({
    content:""
  })
  const [error,setError]=useState({
    content:[]
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
      fr.append('content',modalData.content)
      const res = await add(agentId,fr);
      
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
          content:""
        })
        await onSubmit()
      }
      
    };
  return (
    <Modal show={show}>
      <Header className='flex items-center'>
        <h2 className="text-lg font-bold">Add Knowledge</h2>
        <Button className="text-red" onClick={() => setShow(false)}>
          <X size={16} color="red"/>
        </Button>
      </Header>
      <Body>
        <form onSubmit={handleSubmit} className="max-h-96 p-3 overflow-auto flex flex-col">
          <TextArea
            name="content"
            label="content"
            placeholder="Content"
            onChange={handleChange}
            value={modalData.content}
            icon={<Notebook size={20} className="absolute left-3 top-5 transform -translate-y-1/2 text-gray-400"/>}
          />
          {
            error.content
            &&
            error.content.map((item,index)=>(
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