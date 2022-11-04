import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Row, Col, Form, Button,
} from 'react-bootstrap';
import { createPost } from '../api';
import fetchDataThunk from '../slices/fetchDataThunk';
import { useAuth } from '../contexts/AuthProvider';
import { hidePoster } from '../slices/visabilitySlice';

function Poster() {
  const dispatch = useDispatch();

  const { username } = useAuth();

  const [header, setHeader] = useState('');

  const [text, setText] = useState('');

  const headerRef = useRef();

  const canPost = () => Boolean(username);

  const onChangeHeader = (event) => {
    setHeader(event.target.value);
  };

  const onChangeText = (event) => {
    setText(event.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!canPost()) {
      return;
    }

    const response = await createPost({ username, header, text });
    if (response.status === 201) {
      setHeader('');
      setText('');
      dispatch(hidePoster());
      dispatch(fetchDataThunk(username));
    }
  };

  useEffect(() => headerRef?.current.focus(), []);

  return (
    <Form className="mb-4 pb-2" onSubmit={onSubmit}>
      <Row>
        <Col md="12" className="mb-3">
          <Form.Label htmlFor="header" visuallyHidden>Header</Form.Label>
          <Form.Control
            id="header"
            placeholder="header"
            aria-label="header"
            aria-describedby="header"
            required=""
            value={header}
            onChange={onChangeHeader}
            ref={headerRef}
          />
        </Col>
        <Col md="12" className="mb-3">
          <Form.Label htmlFor="text" visuallyHidden>Your comment</Form.Label>
          <Form.Control
            id="text"
            placeholder="text"
            as="textarea"
            aria-label="text"
            className="form-control"
            required=""
            rows={2}
            value={text}
            onChange={onChangeText}
          />
        </Col>
        <Col md="12">
          <div className="send d-grid">
            <Button type="submit">Send post</Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
}

export default Poster;
