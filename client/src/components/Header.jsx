import React from 'react';
import {
  Container, Nav, Navbar, NavItem, NavLink,
} from 'react-bootstrap';
import LogButton from './LogButton';
import { useAuth } from '../contexts/AuthProvider';
// import logo from './logo.svg';

function Header() {
  const { username } = useAuth();

  return (
    <Navbar expand="lg" className="App-header">
      <Container>
        <Nav>
          <NavItem>
            <NavLink active href="#">Link</NavLink>
          </NavItem>
        </Nav>
        <Nav>
          <NavItem>
            <NavLink active href="#">Another Link</NavLink>
          </NavItem>
        </Nav>
        <Nav className="ms-auto">
          <NavItem>
            {username || 'Unlogged user'}
          </NavItem>
        </Nav>
        <Nav>
          <NavItem>
            <span className="px-3">
              <img src={username ? '/images/default.jpg' : '/images/unknown.png'} className="img-fluid avatar-header rounded-circle shadow" alt="img" />
            </span>
          </NavItem>
        </Nav>
        <Nav>
          <NavItem>
            <LogButton />
          </NavItem>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
