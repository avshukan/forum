import React, { useEffect, useRef, useState } from 'react';
import {
  Button, Col, Container, Form, Row,
} from 'react-bootstrap';
import Title from './Title';

function Signup() {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });

  const ref = useRef();

  const handleChange = () => { };

  const handleSubmit = () => { };

  useEffect(() => ref?.current.focus(), []);

  return (
    <>
      <Title text="Signup" />
      <Container style={{ padding: '100px 0' }}>
        <Row>
          <Col>
            <Form onSubmit={handleSubmit} className="form-signin p-4 mt-0 bg-white rounded shadow">
              {/* <Form onSubmit={handleSubmit} className="d-block mt-0"> */}
              <h5 className="my-3 text-center">Register your account</h5>
              <Form.Group className="form-floating mb-2">
                <Form.Label htmlFor="name">Name</Form.Label>
                <Form.Control
                  ref={ref}
                  id="name"
                  placeholder="Name"
                  name="name"
                  autoComplete="name"
                  className="form-control"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                  // isInvalid={feedbackError.username}
                  value={data.name}
                />
                {/* {feedbackError.username
                  && <div className="invalid-feedback active show">{t(feedbackError.username)}</div>} */}
              </Form.Group>
              <Form.Group className="form-floating mb-2">
                <Form.Label htmlFor="email">Name</Form.Label>
                <Form.Control
                  id="email"
                  placeholder="Email"
                  name="email"
                  autoComplete="email"
                  className="form-control"
                  onChange={handleChange}
                  value={data.email}
                />
              </Form.Group>
              <Form.Group className="form-floating mb-2">
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control
                  id="password"
                  placeholder="Password"
                  name="password"
                  autoComplete="current-password"
                  className="form-control"
                  type="password"
                  onChange={handleChange}
                  value={data.password}
                />
              </Form.Group>
              <Form.Group className="form-floating mb-2">
                <Form.Label htmlFor="passwordConfirmation">Password Confirmation</Form.Label>
                <Form.Control
                  id="passwordConfirmation"
                  placeholder="Password Confirmation"
                  name="passwordConfirmation"
                  autoComplete="current-password"
                  className="form-control"
                  type="password"
                  onChange={handleChange}
                  value={data.passwordConfirmation}
                />
              </Form.Group>
              <Button type="submit" variant="outline-primary" style={{ width: '100%' }}>Register</Button>
              {/* {signupError
                && <div id="b" className="invalid-feedback active show d-block">{signupError}</div>} */}
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Signup;
