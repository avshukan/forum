import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

function Comment({ comment, refreshPosts }) {
  const {
    id, username, text, created_at: createdAt,
  } = comment;

  const createdAtDate = moment(createdAt);

  return (
    <div className="me-3 mb-3 ps-3 pt-3">
      <div className="d-inline mb-0 pb-0">
        <p className="mb-0 pb-0">{text}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        {username}
        {' '}
        <span style={{ fontSize: 'smaller' }}>{createdAtDate.fromNow()}</span>
      </div>
      <p>{text}</p>
    </div>
  );
}

Comment.propTypes = {
  comment: {
    id: PropTypes.number,
    username: PropTypes.string,
    text: PropTypes.string,
    created_at: PropTypes.string,
  },
  refreshPosts: PropTypes.func,
};

Comment.defaultProps = {
  comment: {},
  refreshPosts: () => { },
};

export default Comment;
