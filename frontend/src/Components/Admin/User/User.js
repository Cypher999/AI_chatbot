"use client"
import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Table, Container,Spinner } from "react-bootstrap";
import Cookies from "js-cookie";
import axios from "axios";
import ModalAdd from "./ModalAdd";
import TableRow from "./TableRow";
import ModalEdit from "./ModalEdit";
import ModalEditPassword from "./ModalEditPassword";
export default ()=> {
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [prevPhotoAdd, setPrevPhotoAdd] = useState(null);
  const [prevPhotoEdit, setPrevPhotoEdit] = useState(null);
  const [showModalEditPassword, setShowModalEditPassword] = useState(false);
  const [modalAddData,setModalAddData]=useState({
    username:"",
    password:"",
    confirm:"",
    photo:null,
  })
  const [modalEditData,setModalEditData]=useState({
    id:0,
    username:"",
    photo:null,
  })
  const [modalEditPassword,setModalEditPassword]=useState({
    id:0,
    password:"",
    confirm:""
  })
  const [data, setData] = useState([]);

  const [loading,setLoading]=useState(true)
  const readData=async()=>{
    setLoading(true);
    let token=Cookies.get('auth-token')
    let req=await axios.get(process.env.NEXT_PUBLIC_API_URL+'admin/user',{
      headers:{
        authorization:"bearer "+token
      }
    })
    req=req.data;
    if(req.status=='success') setData(req.data)
    setLoading(false)
  }
  const readOne=async(id)=>{
    let token=Cookies.get('auth-token')
    let req=await axios.get(process.env.NEXT_PUBLIC_API_URL+'admin/user/'+id,{
      headers:{
        authorization:"bearer "+token
      }
    })
    req=req.data;
    if(req.status=='success') {
        setModalEditData(n=>({
          ...req.data,
          ['photo']:null
        }))
        setPrevPhotoEdit(req.data._photo)
        setShowModalEdit(true)
    }
  }
  const del=async(id)=>{
    let token=Cookies.get('auth-token')
    let req=await axios.delete(process.env.NEXT_PUBLIC_API_URL+'admin/user/'+id,{
      headers:{
        authorization:"bearer "+token
      }
    })
    req=req.data;
    if(req.status=='success') await readData()
  }
  useEffect(()=>{
    readData()
  },[])
  return (
    <Container className="mt-5">
      <h1 className="mb-4">Users</h1>

      {/* Button to Open Modal */}
      <Button variant="primary" onClick={()=>{setShowModalAdd(true)}}>
        Insert Data
      </Button>

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
                <th>Name</th>
                <th>Control</th>
            </tr>
            </thead>
            <tbody>
            {data.map((item,index) => (
                <TableRow 
                key={index} 
                item={item}
                editPasswordHandler={()=>{
                  setShowModalEditPassword(true);
                  setModalEditPassword(n=>({
                    ...n,
                    ['id']:item.id
                  }))
                }}
                
                readOne={readOne} 
                del={del}/>
            ))}
            </tbody>
        </Table>
      }
    </>
      

      <ModalAdd
        showModal={showModalAdd}
        setShowModal={setShowModalAdd}
        prevPhoto={prevPhotoAdd}
        setPrevPhoto={setPrevPhotoAdd}
        modalData={modalAddData}
        setModalData={setModalAddData}
        onSubmit={async()=>{
            setModalAddData({
                password:"",
                username:"",
                photo:null,
            })
            setPrevPhotoAdd(null)
            setShowModalAdd(false)
            await readData()

        }}
      />
      <ModalEdit
        showModal={showModalEdit}
        setShowModal={setShowModalEdit}
        modalData={modalEditData}
        setModalData={setModalEditData}
        prevPhoto={prevPhotoEdit}
        setPrevPhoto={setPrevPhotoEdit}
        onSubmit={async()=>{
            setModalEditData({
                id:0,
                username:"",
                photo:null,
            })
            setShowModalEdit(false)
            setPrevPhotoEdit(null)
            await readData()

        }}
      />
      <ModalEditPassword
        showModal={showModalEditPassword}
        setShowModal={setShowModalEditPassword}
        modalData={modalEditPassword}
        setModalData={setModalEditPassword}
        onSubmit={async()=>{
            setModalEditPassword({
                id:0,
                password:"",
                confirm:"",
            })
            setShowModalEditPassword(false)
            await readData()

        }}
      />
      
    </Container>
  );
}

