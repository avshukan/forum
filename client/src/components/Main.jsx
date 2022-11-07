import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './Header';
import Footer from './Footer';
import Forum from './Forum';
import Signup from './Signup';

function Main() {
  return (
    <>
      <Header />
      <Container className="d-flex flex-column h-100 mx-auto px-0">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Forum />} />
        </Routes>
        <Footer />
      </Container>
    </>
  );
}

export default Main;
