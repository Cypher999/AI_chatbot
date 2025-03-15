"use client"
import Loading from "../shared/loading";
import { Modal,Header,Body } from "../ui/modal";
import { agentList } from "@/utils/services/public";
import { useState,useEffect } from "react";
export default function ModalAgent({show,setShow,setAgent}) {
    const [loading,setLoading]=useState(true)
    const [data,setData]=useState([])
    const handleAgent=function(agent){
        setAgent(agent)
        setShow(false);
    }
    const readAgent=async()=>{
        setLoading(true);
        let req=await agentList();
        if(req.status=="success"){
            setData(req.data)
        }
        setLoading(false);
    }
    useEffect(()=>{
        readAgent();
    },[])
  return (
    <Modal show={show}>
      <Header>
        <h2 className="text-lg font-bold">Choose AI Agent</h2>
          <button
              onClick={() => setShow(false)}
              className="px-4 bg-red-500 text-white rounded-lg"
          >
              Close
          </button>
      </Header>
      <Body>
        {
            loading
            ?
            <Loading/>
            :
            data.map((item,index)=>(
                <div key={index} type="button" onClick={()=>{handleAgent(item)}} className="rounded border p-2 my-2 border-gray-700 hover:text-black hover:bg-gray-200 cursor-pointer">
                    <div className="font-bold text-lg">
                        {item.name}
                    </div>
                    <div className="text-sm">
                        {item.description}
                    </div>
                </div>
            ))
        }
      </Body>
    </Modal>
  );
}