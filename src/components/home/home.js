"use client"
import { useState } from "react";
import { BotIcon, SendIcon } from "lucide-react";
import ModalExample from "./modalAgent";
export default function Home() {
  const [input, setInput] = useState("");
  const [showModal,setShowModal]=useState(false)
  const [agent,setAgent]=useState("-");
  return (
    <>
        <div className="h-screen bg-black text-gray-200 flex flex-col">
            {/* Top Bar */}
            <div className="h-12 flex items-center px-4 border-b border-gray-700 bg-gray-900">
                <button onClick={()=>{setShowModal(true)}} type="button" className="flex border p-2 m-1 border-gray-200 rounded flex-row hover:bg-gray-600 cursor-pointer">
                    <BotIcon size={20} className="text-gray-300"/>
                    <span className="ml-2">{agent}</span>
                </button>
            </div>
            
            {/* Chat Content */}
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="w-7/8 md:w-1/2 lg:w-3/8 bg-gray-800 p-3 rounded-lg mb-2">
                    <p>Some chat messages...</p>
                </div>
                <div className="w-7/8 md:w-1/2 lg:w-3/8 bg-gray-700 p-3 rounded-lg ml-auto text-right">
                    <p>User response...</p>
                </div>
            </div>
            
            {/* Input Section */}
            <div className="p-4 bg-gray-900 border-t border-gray-700 flex items-center gap-3">
                <textarea
                    placeholder="Write your prompt here."
                    className="flex-1 p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none resize-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                ></textarea>
                <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
                <SendIcon size={20} className="text-gray-300" />
                </button>
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
