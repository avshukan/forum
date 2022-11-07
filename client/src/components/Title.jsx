import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, NavItem } from 'react-bootstrap';
// import logo from './logo.svg';

function Title({ text }) {
  return (
    <NavItem className="App-brand">
      <Navbar.Brand>{text}</Navbar.Brand>
    </NavItem>
  );
}

Title.propTypes = {
  text: PropTypes.string,
};

Title.defaultProps = PropTypes.shape({
  text: '',
});

export default Title;
