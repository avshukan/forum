import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  Container, Form, Button, Row, Col,
} from 'react-bootstrap';
import { createComment } from '../api';
import fetchDataThunk from '../slices/fetchDataThunk';
import { useAuth } from '../contexts/AuthProvider';

// function Commenter({ postId, refreshPosts }) {
function Commenter({ postId }) {
  const dispatch = useDispatch();

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

    const response = await createComment({ username, postId, text });

    if (response.status === 201) {
      setText('');
      await dispatch(fetchDataThunk(username));
    }
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
};

Commenter.defaultProps = {
  postId: 0,
};

export default Commenter;
