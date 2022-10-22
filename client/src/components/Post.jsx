import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Comments from './Comments';

function Post({ post, refreshPosts }) {
  const {
    id, username, header, text, created_at: createdAt, comments,
  } = post;

  const createdAtDate = moment(createdAt);

  return (
    <div className="me-3 mb-3 ps-3 pt-3">
      <div className="d-inline">
        <h4 className="d-inline fw-bold">{header}</h4>
        {' '}
        (
        {username}
        {' '}
        <span style={{ fontSize: 'smaller' }}>{createdAtDate.fromNow()}</span>
        )
      </div>
      <p>{text}</p>
      <Comments postId={id} comments={comments} refreshPosts={refreshPosts} />
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
