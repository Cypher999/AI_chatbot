"use client"
import React, { useEffect, useState } from "react";
import { Row, Button,Card, Spinner, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Cookies from "js-cookie";
const App = () => {
  const [data,setData]=useState({
    botType:0,
    users:0,
    knowledge:0
  })
  const [loading,setLoading]=useState(true)
  const readData=async()=>{
    setLoading(true);
    let token=Cookies.get('auth-token')
    let req=await axios.get(process.env.NEXT_PUBLIC_API_URL+'admin/home',{
      headers:{
        authorization:"bearer "+token
      }
    })
    req=req.data;
    if(req.status=='success') setData(req.data)
    setLoading(false)
  }
  useEffect(()=>{
    readData()
  },[])
  return (
    <>
      {
        loading
        ?
        <div className="d-flex justify-content-between">
          <Spinner/>
        </div>
        :
        <Row className="justify-content-center">
          <Col xs={11} md={5} lg={3}>
            <Card>
              <Card.Header>
                Bot Types
              </Card.Header>
              {/* Card Body */}
              <Card.Body>

                {/* Card Text */}
                <h2>{data.botType}</h2>

                {/* Button */}
                <a href="/admin/bot-type">
                  <Button variant="primary">Read All Data</Button>j
                </a>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={11} md={5} lg={3}>
            <Card>
              <Card.Header>
                Knowledge
              </Card.Header>
              {/* Card Body */}
              <Card.Body>

                {/* Card Text */}
                <h2>{data.knowledge}</h2>

                {/* Button */}
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={11} md={5} lg={3}>
            <Card>
              <Card.Header>
                Users
              </Card.Header>
              {/* Card Body */}
              <Card.Body>

                {/* Card Text */}
                <h2>{data.users}</h2>

                {/* Button */}
                <a href="/admin/users">
                  <Button variant="primary">Read All Data</Button>j
                </a>
              </Card.Body>
            </Card>
          </Col>
          
        </Row>
      }
    </>
  );
};

export default App;

