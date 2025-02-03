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
    onSubmit,
    botId
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
        fr.append('label',modalData.label)
        fr.append('content',modalData.content)
        let token=Cookies.get('auth-token')
        try {
            let req=await axios.put(process.env.NEXT_PUBLIC_API_URL+'admin/knowledge/'+botId+'/'+modalData.id,fr,{
                headers:{
                  'content-type':'multipart/form-data',
                  authorization:"bearer "+token
                }
              })
              req=req.data;
              alert('knowledge data has been updated')
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
            <Modal.Title>Update Data</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                <Form.Label>Label</Form.Label>
                <Form.Control
                    type="text"
                    name="label"
                    value={modalData.label}
                    onChange={formHandle}
                    required
                />
                {typeof(error)=="object"
                     && <div className="text-danger">{error[0].name}</div>}
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>content</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    name="content"
                    value={modalData.content}
                    onChange={formHandle}
                    required
                />
                {typeof(error)=="object"
                     && <div className="text-danger">{error[0].content}</div>}
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