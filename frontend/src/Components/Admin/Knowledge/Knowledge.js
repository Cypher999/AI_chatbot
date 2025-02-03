"use client"
import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Table, Container,Spinner } from "react-bootstrap";
import Cookies from "js-cookie";
import axios from "axios";
import ModalAdd from "./ModalAdd";
import TableRow from "./TableRow";
import ModalEdit from "./ModalEdit";
export default ({id})=> {
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [botName,setBotName]=useState("")
  const [modalAddData,setModalAddData]=useState({
    label:"",
    content:""
  })
  const [modalEditData,setModalEditData]=useState({
    id:0,
    label:"",
    content:""
  })
  const [data, setData] = useState([]);

  const [loading,setLoading]=useState(true)
  const readData=async()=>{
    setLoading(true);
    let token=Cookies.get('auth-token')
    let req=await axios.get(process.env.NEXT_PUBLIC_API_URL+'admin/knowledge/'+id,{
      headers:{
        authorization:"bearer "+token
      }
    })
    req=req.data;
    if(req.status=='success') setData(req.data)
    setLoading(false)
  }
  const readBot=async()=>{
    setLoading(true);
    let token=Cookies.get('auth-token')
    let req=await axios.get(process.env.NEXT_PUBLIC_API_URL+'admin/bot-type/'+id,{
      headers:{
        authorization:"bearer "+token
      }
    })
    req=req.data;
    if(req.status=='success') setBotName(req.data.name)
    setLoading(false)
  }
  const readOne=async(knowledgeId)=>{
    let token=Cookies.get('auth-token')
    let req=await axios.get(process.env.NEXT_PUBLIC_API_URL+'admin/knowledge/'+id+'/'+knowledgeId,{
      headers:{
        authorization:"bearer "+token
      }
    })
    req=req.data;
    if(req.status=='success') {
        setModalEditData(req.data)
        setShowModalEdit(true)
    }
  }
  const del=async(knowledgeId)=>{
    let token=Cookies.get('auth-token')
    let req=await axios.delete(process.env.NEXT_PUBLIC_API_URL+'admin/knowledge/'+id+'/'+knowledgeId,{
      headers:{
        authorization:"bearer "+token
      }
    })
    req=req.data;
    if(req.status=='success') await readData()
  }
  useEffect(()=>{
    readData()
    readBot()
  },[])
  return (
    <Container className="mt-5">
      <h1 className="mb-4">Knowledge Data</h1>
      <b>Bot Type : {botName}</b>
      {/* Button to Open Modal */}
      <div className="d-flex align-items-center justify-content-start">
        <Button className="m-2" variant="primary" onClick={()=>{setShowModalAdd(true)}}>
          Insert Data
        </Button>
        <a href="/admin/bot-type">
        <Button variant="success">
          Go Back
        </Button>
        </a>
      </div>

      {/* Table to Display Data */}
      <>
      {
        loading
        ?
        <div className="d-flex justify-content-between">
          <Spinner/>
        </div>
        :
        <Table striped bordered hover className="mt-4">
            <thead>
            <tr>
                <th>Label</th>
                <th>content</th>
                <th>Control</th>
            </tr>
            </thead>
            <tbody>
            {data.map((item,index) => (
                <TableRow key={index} item={item} readOne={readOne} del={del}/>
            ))}
            </tbody>
        </Table>
      }
    </>
      

      <ModalAdd
        showModal={showModalAdd}
        setShowModal={setShowModalAdd}
        modalData={modalAddData}
        setModalData={setModalAddData}
        botId={id}
        onSubmit={async()=>{
            setModalAddData({
                content:"",
                label:""
            })
            setShowModalAdd(false)
            await readData()

        }}
      />
      <ModalEdit
      botId={id}
        showModal={showModalEdit}
        setShowModal={setShowModalEdit}
        modalData={modalEditData}
        setModalData={setModalEditData}
        onSubmit={async()=>{
            setModalEditData({
                id:0,
                content:"",
                label:""
            })
            setShowModalEdit(false)
            await readData()

        }}
      />
      
    </Container>
  );
}

