"use client"
import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Table, Container,Spinner, Card } from "react-bootstrap";
import Cookies from "js-cookie";
import axios from "axios";
import ModalEdit from "./ModalEdit";
import ModalEditPassword from "./ModalEditPassword";
export default ()=> {
  const [showModalEdit, setShowModalEdit] = useState(false);
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
    old:"",
    new:"",
    confirm:""
  })
  const [data, setData] = useState({});

  const [loading,setLoading]=useState(true)
  const readData=async()=>{
    setLoading(true);
    let token=Cookies.get('auth-token')
    let req=await axios.get(process.env.NEXT_PUBLIC_API_URL+'user/personal',{
      headers:{
        authorization:"bearer "+token
      }
    })
    req=req.data;
    if(req.status=='success') {
      setData(req.data)
      setModalEditData(n=>({
        ...req.data,
        ['photo']:null
      }))
      setPrevPhotoEdit(req.data._photo)
    }
    setLoading(false)
  }
  useEffect(()=>{
    readData()
  },[])
  return (
    <Container className="mt-5">
      <>
      {
        loading
        ?
        <div className="d-flex justify-content-between">
          <Spinner/>
        </div>
        :
        <Card>
          <Card.Header>
            <h2>Personal Setting</h2>
          </Card.Header>
          <Card.Body>
            <div className="my-4">
              <label>Username</label>
              <div>
                <b>{data.username}</b>
              </div>
            </div>
            <div className="my-4">
              <label>Photo</label>
              <div>
                <img src={data._photo} style={{width:250,height:250}}/>
              </div>
            </div>
          </Card.Body>
          <Card.Footer>
            <Button variant="primary" className="mx-4" onClick={()=>{setShowModalEdit(true)}}>
              Update Data
            </Button>
            <Button variant="primary" className="mx-4" onClick={()=>{setShowModalEditPassword(true)}}>
              Update Password
            </Button>
          </Card.Footer>
        </Card>
      }
    </>
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
                new:"",
                old:"",
                confirm:"",
            })
            setShowModalEditPassword(false)
            await readData()

        }}
      />
      
    </Container>
  );
}

