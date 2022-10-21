import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import UsernameBadge from './UsernameBadge';
import LogButton from './LogButton';
// import logo from './logo.svg';

function Header() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home" className="me-auto d-flex">
          <h3>User:</h3>
          <UsernameBadge />
        </Navbar.Brand>
        <Nav>
          <LogButton />
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
