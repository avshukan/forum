import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import {
  Button, Container, Row, Col,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Comments from './Comments';
import { useAuth } from '../contexts/AuthProvider';
import { deletePost } from '../api';
import fetchDataThunk from '../slices/fetchDataThunk';

function Post({ post }) {
  const dispatch = useDispatch();

  const {
    id, username: usernamePost, header, text, created_at: createdAt, comments,
  } = post;

  const { username } = useAuth();

  const createdAtDate = moment(createdAt);

  const canDelete = () => username === usernamePost;

  const onDelete = () => deletePost({ username, postId: id })
    .then((response) => {
      if (response.status === 204) {
        dispatch(fetchDataThunk(username));
      }
    });

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
          <Button variant="danger" onClick={onDelete} disabled={!canDelete()}>
            <FontAwesomeIcon icon={faTrash} color="white" />
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Comments postId={id} comments={comments} />
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
};

Post.defaultProps = PropTypes.shape({
  post: {},
});

export default Post;
