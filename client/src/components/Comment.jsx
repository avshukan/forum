import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Button, Container, Row, Col,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthProvider';

function Comment({ comment, refreshPosts }) {
  const {
    id, post_id: postId, username: usernameComment, text, created_at: createdAt,
  } = comment;

  const { username } = useAuth();

  const createdAtDate = moment(createdAt);

  const onDelete = () => fetch(`http://localhost:5000/api/v1/posts/${postId}/comments/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ username }),
  })
    .then((response) => {
      console.log('response.status', response.status);
      refreshPosts();
    })
    .catch((error) => console.log(error));

  return (
    <Container className="me-3 mb-3 ps-3 pt-3">
      <Row>
        <Col>
          <div className="d-inline mb-0 pb-0">
            <p className="mb-0 pb-0">{text}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            {usernameComment}
            {' '}
            <span style={{ fontSize: 'smaller' }}>{createdAtDate.fromNow()}</span>
          </div>
        </Col>
        <Col xs="1">
          <Button variant="danger" onClick={onDelete}>
            {/* <FontAwesomeIcon icon={faTrash} /> */}
            <FontAwesomeIcon icon={faTrash} size="xs" color="white" />
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number,
    post_id: PropTypes.number,
    username: PropTypes.string,
    text: PropTypes.string,
    created_at: PropTypes.string,
  }),
  refreshPosts: PropTypes.func,
};

Comment.defaultProps = {
  comment: {},
  refreshPosts: () => { },
};

export default Comment;
