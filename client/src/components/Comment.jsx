import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import Icon from '@mdi/react';
import { mdiDelete } from '@mdi/js';
import { useAuth } from '../contexts/AuthProvider';
import { deleteComment } from '../api';
import fetchDataThunk from '../slices/fetchDataThunk';

function Comment({ comment }) {
  const {
    id,
    post_id: postId,
    username: usernameComment,
    text,
    status,
    created_at: createdAt,
    updated_at: updatedAt,
  } = comment;

  const dispatch = useDispatch();

  const { username } = useAuth();

  const createdAtDate = moment(createdAt);

  const updatedAtDate = moment(updatedAt);

  const isDeleted = () => status === 'deleted';

  const canDelete = () => username === usernameComment && !isDeleted();

  const onDelete = (event) => {
    event.preventDefault();
    return deleteComment({ username, postId, commentId: id })
      .then((response) => {
        if (response.status === 204) {
          dispatch(fetchDataThunk(username));
        }
      });
  };

  return (
    <li className="mt-4">
      <div className="d-flex justify-content-between">
        <div className="d-flex align-items-center">
          <span className="pe-3">
            <img src="/images/default.jpg" className="img-fluid avatar-comment rounded-circle shadow" alt="img" />
          </span>
          <div>
            <h6 className="mb-0"><span className="text-dark media-heading">{usernameComment}</span></h6>
            <small className="text-muted">{createdAtDate.fromNow()}</small>
            {' '}
            {isDeleted() && (
              <small className="text-muted border border-danger px-1">
                {`deleted ${updatedAtDate.fromNow()}`}
              </small>
            )}
          </div>
        </div>
        {
          canDelete()
          && (
            <div className="cursor-pointer text-muted ms-3 strong-hover" role="button" onClick={onDelete}>
              <Icon path={mdiDelete} title="Delete comment" size={1} color="red" />
              {' Delete'}
            </div>
          )
        }
      </div>
      <div className="mt-3">
        <p className="text-muted fst-italic p-3 bg-light">{text}</p>
      </div>
    </li>

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
    updated_at: PropTypes.string,
  }),
};

Comment.defaultProps = {
  comment: {},
};

export default Comment;
