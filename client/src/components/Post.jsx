import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

function Post({ post, refreshPosts }) {
  const {
    username, header, text, created_at: createdAt, comments,
  } = post;

  const createdAtDate = moment(createdAt);

  return (
    <div className="me-3 mb-3 ps-3 pt-3">
      <h4 className="fw-bold">
        {header}
        (
        {username}
        {' '}
        <span style={{ fontSize: 'smaller' }}>{createdAtDate.fromNow()}</span>
        )
      </h4>
      <p>{text}</p>
      <p>{JSON.stringify(comments)}</p>
    </div>
  );
}

Post.propTypes = {
  post: {
    id: PropTypes.number,
    username: PropTypes.string,
    header: PropTypes.string,
    text: PropTypes.string,
    created_at: PropTypes.string,
    comments: PropTypes.arrayOf(PropTypes.func),
  },
  refreshPosts: PropTypes.func,
};

Post.defaultProps = {
  post: {},
  refreshPosts: () => { },
};

export default Post;
