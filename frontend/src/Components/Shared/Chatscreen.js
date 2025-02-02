"use client"
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, InputGroup, Container, Spinner } from "react-bootstrap";
import { useState,useEffect } from "react";
import BotTypeModal from "./BotTypeModal";
import axios from "axios";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight,faArrowDown } from "@fortawesome/free-solid-svg-icons";
export default () => {
    const [botType,setBotType]=useState({
        id:'1',
        name:'bobobot'
    })
    const [data,setData]=useState([]);
    const [prompt,setPrompt]=useState("");
    const [loading,setLoading]=useState(false);
    const [loadingBot,setLoadingBot]=useState(false);
    const [showBotTypeModal,setShowBotTypeModal]=useState(false)
    const readBotData=async()=>{
        console.log(Cookies.get())
        setLoadingBot(true);
        let req=await axios.get(process.env.NEXT_PUBLIC_API_URL+'bot-type');
        req=req.data;
        if(req.status=="success"){
            if(req.data.length>0){
                setBotType({
                    id:req.data[0].id,
                    name:req.data[0].name
                })
            }
            else {
                setBotType({
                    id:0,
                    name:'-'
                })
            }
        }
        setLoadingBot(false);
    }
    const sendData=async()=>{
        setLoading(true);
        setData((n)=>([
            ...n,
            {
                ['from']:'me',
                ['content']:prompt
            }
        ]))
        const fr=new FormData();;
        fr.append("prompt",prompt)
        let req=await axios.post(process.env.NEXT_PUBLIC_API_URL+'chat/'+botType.id,fr);
        req=req.data;
        if(req.status=='success'){
            setData((n)=>([
                ...n,
                {
                    ['from']:'bot',
                    ['content']:req.data
                }
            ]))
        }
        setPrompt("")
        setLoading(false);
    }
    useEffect(()=>{
        readBotData();;
    },[])
  return (
    <>
        <Container className="p-3" style={{ maxWidth: "500px", background: "#f8f9fa", borderRadius: "10px" }}>
            <div className="d-flex justify-content-between align-items-center p-2 bg-primary text-white rounded-top">
                <h5 className="m-0" onClick={()=>{
                    setShowBotTypeModal(true)
                }}>{
                    loadingBot
                    ?
                    <Spinner animation="border" variant="primary"/>
                    :
                    botType.name
                } <FontAwesomeIcon icon={faArrowDown} size="1x"/></h5>
            </div>
            <div className="p-3" style={{ background: "white", borderRadius: "10px", height:'70vh',overflow:'scroll' }}>
                {
                    data.length==0
                    ?
                    <div className="d-flex justify-content-end mb-2">
                        <div className="bg-primary text-white p-2 rounded" style={{ maxWidth: "75%" }}>
                            Type something
                        </div>
                    </div>
                    :
                    <>
                        {
                        data.map((item,index)=>(
                            <div key={index}>
                                {
                                    item.from=='me'
                                    ?
                                    <div className="d-flex justify-content-end mb-2">
                                        <div className="bg-primary text-white p-2 rounded" style={{ maxWidth: "75%" }}>
                                            {item.content}
                                        </div>
                                    </div>
                                    :
                                    <div className="mb-2">
                                        <div className="bg-light p-2 rounded" style={{ maxWidth: "75%" }}>
                                            {item.content}
                                        </div>
                                    </div>
                                }
                            </div>

                        ))
                    }
                    </>
                }
                
                
            </div>
            
            {/* Input Box */}
            <InputGroup className="mt-2">
                {
                    loading
                    ?
                    <Spinner animation="border" variant="primary"/>
                    :
                    <>
                        <Form.Control 
                        onChange={(e)=>{
                            setPrompt(e.target.value)
                        }}
                        onKeyUp={(e)=>{
                            if(e.key=="Enter"){
                                sendData()
                            }
                        }}
                        type="text" placeholder="Type something" />
                        <Button
                        onClick={async ()=>{
                            await sendData()
                        }}
                        variant="success">
                            <FontAwesomeIcon icon={faArrowRight}/>
                        </Button>
                    </>
                }
            </InputGroup>
        </Container>
        <BotTypeModal 
            showModal={showBotTypeModal} 
            setShowModal={setShowBotTypeModal}
            setBotType={setBotType}
            setChatData={setData}
        />
    </>
  );
};
