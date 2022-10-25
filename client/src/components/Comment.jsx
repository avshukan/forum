import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import {
  Button, Container, Row, Col,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import { useAuth } from '../contexts/AuthProvider';
import { deleteComment } from '../api';
import fetchDataThunk from '../slices/fetchDataThunk';

function Comment({ comment }) {
  const {
    id, post_id: postId, username: usernameComment, text, status, created_at: createdAt,
  } = comment;

  const dispatch = useDispatch();

  const { username } = useAuth();

  const createdAtDate = moment(createdAt);

  const isDeleted = () => status === 'deleted';

  const canDelete = () => username === usernameComment && !isDeleted();

  const onDelete = () => deleteComment({ username, postId, commentId: id })
    .then((response) => {
      if (response.status === 204) {
        dispatch(fetchDataThunk(username));
      }
    });

  return (
    <Container className={classnames('me-3 mb-3 ps-3 pt-3', { 'border border-danger rounded': isDeleted() })}>
      <Row>
        <Col>
          <div className="d-inline mb-0 pb-0">
            {isDeleted() && <p className="text-danger">Deleted</p>}
            <p className="mb-0 pb-0">{text}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            {usernameComment}
            {' '}
            <span style={{ fontSize: 'smaller' }}>{createdAtDate.fromNow()}</span>
          </div>
        </Col>
        <Col xs="1">
          <Button variant="danger" onClick={onDelete} disabled={!canDelete()}>
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
    status: PropTypes.string,
    created_at: PropTypes.string,
  }),
};

Comment.defaultProps = {
  comment: {},
};

export default Comment;
