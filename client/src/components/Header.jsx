import React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import LogButton from './LogButton';
import { useAuth } from '../contexts/AuthProvider';
import CreatePostButton from './CreatePostButton';
// import logo from './logo.svg';

function Header() {
  const { username } = useAuth();

  return (
    <Navbar expand="lg" className="container App-header px-0">
      <Nav>
        <NavItem>
          <CreatePostButton />
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
    </Navbar>
  );
}

export default Header;
