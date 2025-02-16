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
    prevPhoto,
    setPrevPhoto,
    onSubmit
})=>{
    const formHandle=(e)=>{
        if(e.target.getAttribute('type')=='file'){
            setModalData(n=>({
                ...n,
                [e.target.name]:e.target.files[0]
            }))
        }
        else{
            setModalData(n=>({
                ...n,
                [e.target.name]:e.target.value
            }))
        }
    }
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState("")
    const sendData=async(e)=>{
        setLoading(true);
        const fr=new FormData();
        fr.append('username',modalData.username)
        fr.append('password',modalData.password)
        fr.append('confirm',modalData.confirm)
        fr.append('role',modalData.role)
        fr.append('photo',modalData.photo)
        let token=Cookies.get('auth-token')
        try {
            let req=await axios.post(process.env.NEXT_PUBLIC_API_URL+'admin/user',fr,{
                headers:{
                  'content-type':'multipart/form-data',
                  authorization:"bearer "+token
                }
              })
              req=req.data;
              alert('user has been added')
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
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={modalData.username}
                        onChange={formHandle}
                        required
                    />
                    {typeof(error)=="object"
                        && <div className="text-danger">{error[0].username}</div>}
                </Form.Group>
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
                <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                        name="role"
                        value={modalData.role}
                        onChange={formHandle}
                        required
                    >
                        <option value="">--pilih--</option>
                        <option value="admin">admin</option>
                        <option value="user">user</option>
                    </Form.Select>
                    {typeof(error)=="object"
                        && <div className="text-danger">{error[0].confirm}</div>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Photo</Form.Label>
                    <div>
                        <input type="file" name="photo" onChange={(e)=>{
                            formHandle(e)
                            setPrevPhoto(URL.createObjectURL(e.target.files[0]))
                        }}/>
                    </div>
                    <div>
                        <img src={prevPhoto} style={{width:200,height:200}}/>
                    </div>
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