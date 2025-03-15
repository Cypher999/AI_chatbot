"use client"
import { useEffect, useState } from "react";
import { BotIcon, SendIcon } from "lucide-react";
import ModalExample from "./modalAgent";
import { agentList, sendPrompt } from "@/utils/services/public";
import Loading from "../shared/loading";
import Swal from "sweetalert2";
export default function Home() {
  const [input, setInput] = useState("");
  const [data,setData]=useState([]);
  const [showModal,setShowModal]=useState(false)
  const [loadingAgent,setLoadingAgent]=useState(true)
  const [loading,setLoading]=useState(false)
  const [agent,setAgent]=useState({
    id:null,
    name:"",
  });
    const readAgent=async()=>{
    setLoadingAgent(true);
    let req=await agentList();
    if(req.status=="success"){
        if(req.data.length>0){
            setAgent({
                id:req.data[0].id,
                name:req.data[0].name
            })
        }
        else {
            setAgent({
                id:0,
                name:'-'
            })
        }
    }
    setLoadingAgent(false);
    }
    const sendData=async()=>{
        setLoading(true);
        setData((n)=>([
            ...n,
            {
                ['from']:'me',
                ['content']:input
            }
        ]))
        const fr=new FormData();;
        fr.append("prompt",input)
        let req=await sendPrompt(agent.id,fr);
        if(req.status=='success'){
            setData((n)=>([
                ...n,
                {
                    ['from']:'AI',
                    ['content']:req.data
                }
            ]))
        }
        else{
            Swal.fire({
                toast: true,
                position: "top-end", // Position to bottom-right
                icon: "success",
                title: req.message,
                showConfirmButton: false,
                timer: 3000, // Auto-close after 3 seconds
                timerProgressBar: true,
                background: "#343a40", // Dark theme
                color: "#fff", // White text
            });
        }
        setInput("")
        setLoading(false);
    }
    useEffect(()=>{
        readAgent();
    },[])
  return (
    <>
        <div className="h-screen bg-black text-gray-200 flex flex-col">
            {/* Top Bar */}
            <div className="h-12 flex items-center px-4 border-b border-gray-700 bg-gray-900">
                {
                    loadingAgent
                    ?
                    <Loading/>
                    :
                    <button onClick={()=>{setShowModal(true)}} type="button" className="flex border p-2 m-1 border-gray-200 rounded flex-row hover:bg-gray-600 cursor-pointer">
                        <BotIcon size={20} className="text-gray-300"/>
                        <span className="ml-2">{agent.name}</span>
                    </button>
                }
            </div>
            
            {/* Chat Content */}
            <div className="flex-1 p-4 overflow-y-auto">
                {
                    data.map((item,index)=>(
                        item.from=='AI'
                        ?
                        <div key={index} className="w-7/8 md:w-1/2 lg:w-3/8 bg-gray-800 p-3 rounded-lg mb-2">
                            <p>{item.content}</p>
                        </div>
                        :
                        <div key={index} className="w-7/8 md:w-1/2 lg:w-3/8 bg-gray-700 p-3 mb-2 rounded-lg ml-auto text-right">
                           <p>{item.content}</p>
                        </div>
                    ))
                }
            </div>
            
            {/* Input Section */}
            <div className="p-4 bg-gray-900 border-t border-gray-700 flex items-center gap-3">
                <textarea
                    placeholder="Write your prompt here."
                    className="flex-1 p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none resize-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                ></textarea>
                {
                    loading
                    ?
                    <Loading/>
                    :
                    <button onClick={()=>{sendData()}} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
                        <SendIcon size={20} className="text-gray-300" />
                    </button>
                }
            </div>
        </div>
        <ModalExample
            setAgent={setAgent}
            show={showModal}
            setShow={setShowModal}
        />
    </>
  );
}
