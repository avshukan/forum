import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Button, Container, Row, Col,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Comments from './Comments';
import { useAuth } from '../contexts/AuthProvider';

function Post({ post, refreshPosts }) {
  const {
    id, username: usernamePost, header, text, created_at: createdAt, comments,
  } = post;

  const { username } = useAuth();

  const createdAtDate = moment(createdAt);

  const onDelete = () => fetch(`http://localhost:5000/api/v1/posts/${id}`, {
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
          <div className="d-inline">
            <h4 className="d-inline fw-bold">{header}</h4>
            {' '}
            (
            {usernamePost}
            {' '}
            <span style={{ fontSize: 'smaller' }}>{createdAtDate.fromNow()}</span>
            )
          </div>
          <p>{text}</p>
        </Col>
        <Col xs="1">
          <Button variant="danger" onClick={onDelete}>
            {/* <FontAwesomeIcon icon={faTrash} /> */}
            <FontAwesomeIcon icon={faTrash} color="white" />
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Comments postId={id} comments={comments} refreshPosts={refreshPosts} />
        </Col>
      </Row>
    </Container>
  );
}

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    header: PropTypes.string,
    text: PropTypes.string,
    created_at: PropTypes.string,
    comments: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      post_id: PropTypes.number,
      username: PropTypes.string,
      text: PropTypes.string,
      created_at: PropTypes.string,
    })),
  }),
  refreshPosts: PropTypes.func,
};

Post.defaultProps = PropTypes.shape({
  post: {},
  refreshPosts: () => { },
});

export default Post;
