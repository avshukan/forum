import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Col, Container, Form, Row,
} from 'react-bootstrap';
// import { login } from '../api';
import { useDispatch } from 'react-redux';
import Title from './Title';
import loginThunk from '../slices/loginThunk';

function Login() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [data, setData] = useState({
    username: '',
    password: '',
  });

  const ref = useRef();

  const handleChange = (event) => {
    event.preventDefault();
    const { target } = event;
    const name = target.getAttribute('name');
    const { value } = target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // need to check password confirmation
    // need to check minimal length and email format
    console.log('data', data);
    const { username, password } = data;
    // const response = await login({ username, email, password });
    console.log('username, password', username, password);
    const response = dispatch(loginThunk({ username, password }));

    console.log('response + status', response, response.status);

    // if (response.status === 201) {
    //   // const { token, id, username } = await response.json();
    //   const { token, id } = await response.json();
    //   localStorage.setItem('token', token);
    //   localStorage.setItem('id', id);
    //   localStorage.setItem('username', username);
    //   redirect('/');
    //   // save token, id & username into store
    //   // dispatch(hideCommenter());
    // }
    navigate('/');
  };

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
                  name="username"
                  autoComplete="name"
                  className="form-control"
                  onChange={handleChange}
                  // onBlur={handleBlur}
                  // isInvalid={feedbackError.username}
                  value={data.username}
                />
                {/* {feedbackError.username
                  && <div className="invalid-feedback active show">
                  {t(feedbackError.username)}</div>} */}
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
              <Button type="submit" variant="outline-primary" style={{ width: '100%' }}>Log in</Button>
              {/* {signupError
                && <div id="b" className="invalid-feedback active show d-block">
                {signupError}</div>} */}
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;
