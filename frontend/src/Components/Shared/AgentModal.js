"use client"
import { Button, Form, InputGroup, Container, Modal,Spinner } from "react-bootstrap";
import axios from "axios";
import { useState,useEffect } from "react";
export default ({
    showModal,
    setShowModal,
    setAgent,
    setChatData
})=>{
    const [data,setData]=useState([])
    const [loading,setLoading]=useState(true)
    const readData=async()=>{
        setLoading(true);
        let req=await axios.get(process.env.NEXT_PUBLIC_API_URL+'agent');
        req=req.data;
        if(req.status=="success"){
            setData(req.data);
        }
        setLoading(false);
    }
    useEffect(()=>{
        readData();
    },[showModal])
    return (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
            <Modal.Title>Select Agent</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    loading
                    ?
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" variant="primary" />
                    </div>
                    :
                    <>
                        {
                            data.map((item,index)=>(
                                <div onClick={()=>{
                                    setAgent({
                                        id:item.id,
                                        name:item.name
                                    })
                                    setChatData([])
                                    setShowModal(false)
                                }} key={index} className="border border-1 m-1 p-2">
                                    {item.name}
                                </div>
                            ))
                        }
                    </>
                }
            </Modal.Body>
        </Modal>
    )
}