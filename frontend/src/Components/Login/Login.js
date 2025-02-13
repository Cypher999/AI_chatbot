"use client"
import { Row, Button,Card, Spinner, Col,Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
export default  () => {
    const [data,setData]=useState({
        username:"",
        password:""
    })
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState("")
    const formHandle=(e)=>{
        setData(n=>({
            ...n,
            [e.target.name]:e.target.value
        }))
    }
    const sendData=async(e)=>{
        e.preventDefault();
        setLoading(true);
        const fr=new FormData();
        fr.append('username',data.username)
        fr.append('password',data.password)
        try {
            let req=await axios.post(process.env.NEXT_PUBLIC_API_URL+'auth',fr,{
                headers:{
                  'content-type':'multipart/form-data'
                }
              })
              req=req.data;
              Cookies.set('auth-token',req.data.accessToken)
              window.location.href="/"+req.data.role
          } catch (error) {
            setError(error.response.data.message)
          }
          finally{setLoading(false)}
        
        
        
      }
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
    <Card style={{ width: '300px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
      <Card.Body>
        <Card.Title className="text-center">Login</Card.Title>
        <Form onSubmit={sendData}>
          <Form.Group controlId="formLogin" className="mb-3">
            <Form.Control onChange={formHandle} type="text" name="username" placeholder="login" />
            {typeof(error)=="object"
             && <div className="text-danger">{error[0].username}</div>}
          </Form.Group>
          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Control onChange={formHandle} type="password" name="password" placeholder="password" />
            {typeof(error)=="object"
             && <div className="text-danger">{error[1].password}</div>}
          </Form.Group>
            {error!=""&&typeof(error)!="object" && <div className="text-danger">{error}</div>}
            {
                loading
                ?
                <div className="d-flex justify-content-center">
                    <Spinner/>
                </div>
                :
                <Button variant="primary" type="submit" className="w-100">
                    LOG IN
                </Button>
            }
        </Form>
      </Card.Body>
    </Card>
  </div>
  );
};