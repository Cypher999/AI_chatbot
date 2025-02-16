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
        fr.append('new',modalData.new)
        fr.append('old',modalData.old)
        fr.append('confirm',modalData.confirm)
        let token=Cookies.get('auth-token')
        try {
            let req=await axios.put(process.env.NEXT_PUBLIC_API_URL+'user/personal/update-password',fr,{
                headers:{
                  'content-type':'multipart/form-data',
                  authorization:"bearer "+token
                }
              })
              req=req.data;
              alert('password has been updated')
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
            <Modal.Title>Update Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="old"
                        value={modalData.old}
                        onChange={formHandle}
                        required
                    />
                    {typeof(error)=="object"
                        && <div className="text-danger">{error[0].old}</div>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="new"
                        value={modalData.new}
                        onChange={formHandle}
                        required
                    />
                    {typeof(error)=="object"
                        && <div className="text-danger">{error[0].new}</div>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Confirm</Form.Label>
                    <Form.Control
                        type="password"
                        name="confirm"
                        value={modalData.confirm}
                        onChange={formHandle}
                        required
                    />
                    {typeof(error)=="object"
                        && <div className="text-danger">{error[0].confirm}</div>}
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