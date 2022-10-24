import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Container, Form, Button, Row, Col,
} from 'react-bootstrap';
import backendRoutes from '../routes/backendRoutes';
import { useAuth } from '../contexts/AuthProvider';

function Commenter({ postId, refreshPosts }) {
  const { username } = useAuth();

  const [text, setText] = useState('');

  const canComment = () => !!username;

  const onChangeText = (event) => {
    setText(event.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!canComment()) {
      return;
    }

    const response = await fetch(backendRoutes.comments(postId).href, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ username, text }),
    });
    if (response.status === 201) {
      setText('');
    }
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
            <Button type="submit" className="mb-2" disabled={!canComment()}>Comment</Button>
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
