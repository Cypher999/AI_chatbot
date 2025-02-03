"use client"
import React, { useState } from "react";
import { Container, Row, Col, Nav, Navbar, Button, Dropdown,Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome,faRobot,faUser } from "@fortawesome/free-solid-svg-icons";
export default ({children}) => {
    const [showMenu, setShowMenu] = useState(false);
  
    const toggleMenu = () => {
      setShowMenu(!showMenu);
    };
  
    return (
      <Container fluid className="p-0">
        {/* Top Bar */}
        <Navbar bg="dark" variant="dark" className="p-3">
          {/* Button to toggle menu (visible only on mobile) */}
          <Button variant="outline-light" onClick={toggleMenu} className="d-md-none">
            {showMenu ? "Hide Menu" : "Show Menu"}
          </Button>
  
          {/* Dropdown for User Settings (aligned to the right) */}
          <Navbar.Collapse style={{position:"relative",right:"20px"}} className="justify-content-end">
            <Dropdown>
              <Dropdown.Toggle variant="outline-light" id="dropdown-user-settings">
                User Settings
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#profile">Profile</Dropdown.Item>
                <Dropdown.Item href="#logout">Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Navbar>
  
        {/* Main Content Area */}
        <Row className="g-0">
          {/* Menu Bar (Left) */}
          <Col
            xs={12}
            md={3}
            className={`bg-light vh-100 p-3 ${showMenu ? "d-block" : "d-none d-md-block"}`}
          >
            <Nav className="flex-column">
              <Nav.Link href="/admin" className="border border-1 rounded-3 mb-2">
                <FontAwesomeIcon icon={faHome}/>
                <span className="ms-3">Home</span>
              </Nav.Link>
              <Nav.Link href="/admin/bot-type" className="border border-1 rounded-3 mb-2">
                <FontAwesomeIcon icon={faRobot}/>
                <span className="ms-3">Bot Types</span>
              </Nav.Link>
              <Nav.Link href="/admin/users" className="border border-1 rounded-3 mb-2">
                <FontAwesomeIcon icon={faUser}/>
                <span className="ms-3">Users</span>
              </Nav.Link>
            </Nav>
          </Col>
  
          {/* Main Content (Right) */}
          <Col
            xs={12}
            md={9}
            className="p-3"
          >
            {children}
          </Col>
        </Row>
      </Container>
    );
  };