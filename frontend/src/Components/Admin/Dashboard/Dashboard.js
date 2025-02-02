"use client"
import React from 'react';
import { Container, Row, Col, Navbar, Nav, Button, Card,Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default ()=> {
  return (
    <div className="App">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#home">Aqumex</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Dashboard</Nav.Link>
              <Nav.Link href="#link">Projects</Nav.Link>
              <Nav.Link href="#link">Messages</Nav.Link>
              <Nav.Link href="#link">Analytics</Nav.Link>
            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Quick Search..."
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-light">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col md={2} className="bg-light sidebar">
            <h5 className="mt-3">SHORTCUTS</h5>
            <Nav className="flex-column">
              <Nav.Link href="#dashboard">Dashboard</Nav.Link>
              <Nav.Link href="#projects">Projects</Nav.Link>
              <Nav.Link href="#messages">Messages</Nav.Link>
              <Nav.Link href="#analytics">Analytics</Nav.Link>
            </Nav>
          </Col>

          {/* Content Area */}
          <Col md={10} className="mt-4">
            <h2>Dashboard</h2>
            <Row>
              <Col md={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>Card 1</Card.Title>
                    <Card.Text>Some quick example text.</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>Card 2</Card.Title>
                    <Card.Text>Some quick example text.</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>Card 3</Card.Title>
                    <Card.Text>Some quick example text.</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
