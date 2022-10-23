import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Container, Form, Button, Row, Col,
} from 'react-bootstrap';
import { useAuth } from '../contexts/AuthProvider';

function Commenter({ postId, refreshPosts }) {
  const { username } = useAuth();

  const [text, setText] = useState('');

  const onChangeText = (event) => {
    setText(event.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`http://localhost:5000/api/v1/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ username, text }),
    });
    const result = await response.json();
    console.log('response.status', response.status);
    console.log('result', result);
    await refreshPosts();
  };

  return (
    <Container style={{ textAlign: 'right' }}>
      <Form onSubmit={onSubmit}>
        <Row className="align-items-center">
          <Col xs="auto" style={{ flexGrow: 1 }}>
            <Form.Label htmlFor="comment" visuallyHidden>Comment</Form.Label>
            <Form.Control
              id="comment"
              className="mb-2"
              style={{ flexGrow: 1 }}
              placeholder="comment"
              aria-label="text"
              aria-describedby="text"
              value={text}
              onChange={onChangeText}
            />
          </Col>
          <Col xs="auto">
            <Button type="submit" className="mb-2">Comment</Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

Commenter.propTypes = {
  postId: PropTypes.number,
  refreshPosts: PropTypes.func,
};

Commenter.defaultProps = {
  postId: 0,
  refreshPosts: () => { },
};

export default Commenter;
