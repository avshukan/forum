import React from 'react';
import { useSelector } from 'react-redux';
import {
  Container, Nav, Navbar, NavItem, NavLink,
} from 'react-bootstrap';
import CreatePostButton from './CreatePostButton';
import LogoutButton from './LogoutButton';
import SignupButton from './SignupButton';
import LoginButton from './LoginButton';
// import logo from './logo.svg';

function Header() {
  const { token, username } = useSelector((state) => state.user);

  return (
    <Container fluid className="App-header-wrapper">
      <Navbar expand="lg" className="container App-header px-0">
        {Boolean(token) && (
        <Nav>
          <NavItem>
            <CreatePostButton />
          </NavItem>
        </Nav>
        )}
        <Nav>
          <NavItem>
            <NavLink href="https://github.com/avshukan/forum">Repo</NavLink>
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
        {Boolean(token)
          && (
            <Nav>
              <NavItem>
                <LogoutButton />
              </NavItem>
            </Nav>
          )}
        {!token && (
          <Nav>
            <NavItem>
              <SignupButton />
            </NavItem>
          </Nav>
        )}
        {!token && (
          <Nav>
            <NavItem>
              <LoginButton />
            </NavItem>
          </Nav>
        )}
      </Navbar>
    </Container>
  );
}

export default Header;
