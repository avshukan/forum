import React from 'react';
import { Navbar, NavItem } from 'react-bootstrap';
// import logo from './logo.svg';

function Brand() {
  return (
    <NavItem className="App-brand">
      <Navbar.Brand href="#home">
        My Forum
      </Navbar.Brand>
    </NavItem>
  );
}

export default Brand;
