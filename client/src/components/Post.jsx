import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import {
  Button, Container, Row, Col,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Icon from '@mdi/react';
import { mdiDelete, mdiReply } from '@mdi/js';
import Comments from './Comments';
import { useAuth } from '../contexts/AuthProvider';
import { deletePost } from '../api';
import fetchDataThunk from '../slices/fetchDataThunk';
import Commenter from './Commenter';

function Post({ post }) {
  const {
    id, username: usernamePost, header, text, created_at: createdAt, comments,
  } = post;

  const [showComments, setShowComments] = useState(false);

  const [showCommenter, setShowCommenter] = useState(false);

  const dispatch = useDispatch();

  const { username } = useAuth();

  const createdAtDate = moment(createdAt);

  const canDelete = () => username === usernamePost;

  const onDelete = () => deletePost({ username, postId: id })
    .then((response) => {
      if (response.status === 204) {
        dispatch(fetchDataThunk(username));
      }
    });

  const commentsCounter = () => comments.length === 0
    ? <small className="text-muted">No comments</small>
    : <small className="text-muted" onClick={() => setShowComments(true)} style={{ cursor: 'pointer' }} >
      {`Show all ${comments.length} comments`}
    </small>

  return (
    // <Container className="me-3 mb-3 ps-3 pt-3">
    //   <Row>
    //     <Col>
    //       <div className="d-inline">
    //         <h4 className="d-inline fw-bold">{header}</h4>
    //         {' '}
    //         (
    //         {usernamePost}
    //         {' '}
    //         <span style={{ fontSize: 'smaller' }}>{createdAtDate.fromNow()}</span>
    //         )
    //       </div>
    //       <p>{text}</p>
    //     </Col>
    //     <Col xs="1">
    //       <Button variant="danger" onClick={onDelete} disabled={!canDelete()}>
    //         <FontAwesomeIcon icon={faTrash} color="white" />
    //       </Button>
    //     </Col>
    //   </Row>
    //   <Row>
    //     <Col>
    //       <Comments postId={id} comments={comments} />
    //     </Col>
    //   </Row>
    // </Container>
    <li className="mt-4">
      <div className="d-flex justify-content-between">
        <div className="d-flex align-items-center">
          <span className="pe-3">
            <img src="images/default.jpg" className="img-fluid avatar-post rounded-circle shadow" alt="img" />
          </span>
          <div className="d-flex flex-column">
            <h6 className="mb-0"><span className="media-heading text-dark">{usernamePost}</span></h6>
            <small className="text-muted">{createdAtDate.fromNow()}</small>
            {commentsCounter()}
          </div>
        </div>
        <span className="reply-comment text-muted" onClick={() => setShowCommenter(true)}>
          <Icon path={mdiReply} title="Reply post" size={1} />
          {' '}
          Reply
        </span>
      </div>
      <div className="mt-3 text-muted fst-italic bg-light p-3">
        <h6>{header}</h6>
        <p>{text}</p>
      </div>
      {showCommenter && <Commenter postId={id} />}
      {showComments && <Comments postId={id} comments={comments} />}
    </li>
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
