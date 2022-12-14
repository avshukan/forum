import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form, Button, Row, Col,
} from 'react-bootstrap';
import { createComment } from '../api';
import fetchDataThunk from '../slices/fetchDataThunk';
import { hideCommenter, showComments } from '../slices/visabilitySlice';
import loggedSelector from '../slices/loggedSelector';

function Commenter({ postId }) {
  const dispatch = useDispatch();

  const isLogged = useSelector(loggedSelector);

  const [text, setText] = useState('');

  const refText = useRef();

  const canComment = () => isLogged();

  const onChangeText = (event) => {
    setText(event.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!canComment()) {
      return;
    }

    const response = await createComment({ postId, text });

    if (response.status === 201) {
      setText('');
      dispatch(hideCommenter());
      dispatch(showComments({ postId }));
      dispatch(fetchDataThunk());
    }
  };

  useEffect(() => refText?.current.focus(), []);

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
              ref={refText}
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
