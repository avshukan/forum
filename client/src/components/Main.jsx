import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Header from './Header';
import Brand from './Brand';
import Footer from './Footer';
import Forum from './Forum';
import Sidebar from './Sidebar';

function Main() {
  return (
    <>
      <Header />
      <Container className="d-flex flex-column h-100 mx-auto px-0">
        <Brand />
        <Container className="px-0">
          <Row>
            <Col lg="8" sm="12" className="mb-5">
              <Forum />
            </Col>
            <Col lg="4" sm="12">
              <Sidebar />
            </Col>
          </Row>
        </Container>
        <Footer />
      </Container>
    </>
  );
}

export default Main;
