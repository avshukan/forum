import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Title from './Title';
import Posts from './Posts';
import Sidebar from './Sidebar';

function Forum() {
  return (
    <>
      <Title text="Forum" />
      <Container className="px-0">
        <Row>
          <Col lg="8" sm="12" className="mb-5">
            <Posts />
          </Col>
          <Col lg="4" sm="12">
            <Sidebar />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Forum;
