"use client"
import { Button, Modal, Form,Spinner } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
export default ({
    showModal,
    setShowModal,
    modalData,
    setModalData,
    onSubmit
})=>{
    const formHandle=(e)=>{
        setModalData(n=>({
            ...n,
            [e.target.name]:e.target.value
        }))
    }
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState("")
    const sendData=async(e)=>{
        setLoading(true);
        const fr=new FormData();
        fr.append('name',modalData.name)
        fr.append('context',modalData.context)
        let token=Cookies.get('auth-token')
        try {
            let req=await axios.post(process.env.NEXT_PUBLIC_API_URL+'admin/agent',fr,{
                headers:{
                  'content-type':'multipart/form-data',
                  authorization:"bearer "+token
                }
              })
              req=req.data;
              alert('agent has been saved')
              await onSubmit()
          } catch (error) {
            setError(error.response.data.message)
          }
          finally{
            setLoading(false)
        }
        
        
        
      }
    return (
        <Modal show={showModal} onHide={()=>{setShowModal(false)}}>
            <Modal.Header closeButton>
            <Modal.Title>Insert Data</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={modalData.name}
                    onChange={formHandle}
                    required
                />
                {typeof(error)=="object"
                     && <div className="text-danger">{error[0].name}</div>}
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>Context</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    name="context"
                    value={modalData.context}
                    onChange={formHandle}
                    required
                />
                {typeof(error)=="object"
                     && <div className="text-danger">{error[0].context}</div>}
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
            {error!=""&&typeof(error)!="object" && <div className="text-danger">{error}</div>}
            {
                loading
                ?
                <div className="d-flex justify-content-center">
                    <Spinner/>
                </div>
                :
                <Button onClick={sendData} variant="primary" type="submit">
                    Insert
                </Button>
            }
           
            </Modal.Footer>
        </Modal>
    )
}