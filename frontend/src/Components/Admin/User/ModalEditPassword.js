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
        fr.append('password',modalData.password)
        fr.append('confirm',modalData.confirm)
        let token=Cookies.get('auth-token')
        try {
            let req=await axios.put(process.env.NEXT_PUBLIC_API_URL+'admin/user/update-password/'+modalData.id,fr,{
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
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={modalData.password}
                        onChange={formHandle}
                        required
                    />
                    {typeof(error)=="object"
                        && <div className="text-danger">{error[0].password}</div>}
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