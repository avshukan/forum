import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  Form, Button, Row, Col,
} from 'react-bootstrap';
import { createComment } from '../api';
import fetchDataThunk from '../slices/fetchDataThunk';
import { useAuth } from '../contexts/AuthProvider';
import { hideCommenter, showComments } from '../slices/visabilitySlice';

function Commenter({ postId }) {
  const dispatch = useDispatch();

  const { username } = useAuth();

  const [text, setText] = useState('');

  const canComment = () => Boolean(username);

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
      dispatch(hideCommenter());
      dispatch(showComments({ postId }));
      dispatch(fetchDataThunk(username));
    }
  };

  return (
    <Form className="mt-4 pt-2" onSubmit={onSubmit}>
      <Row>
        <Col md="12">
          <div className="mb-3">
            <Form.Label htmlFor="comment" visuallyHidden>Your comment</Form.Label>
            <Form.Control
              as="textarea"
              aria-label="comment"
              className="form-control"
              required=""
              rows={2}
              value={text}
              onChange={onChangeText}
            />
          </div>
        </Col>
        <Col md="12">
          <div className="send d-grid">
            <Button type="submit" disabled={!canComment()}>Comment</Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
}

Commenter.propTypes = {
  postId: PropTypes.number,
};

Commenter.defaultProps = {
  postId: 0,
};

export default Commenter;
