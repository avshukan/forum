import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';

function Post({ post, refreshPosts }) {
  const {
    username, header, text, created_at, comments,
  } = post;
  return (
    <div className="ml-4 mt-4 pl-4 pt-4">
      <p>{username}</p>
      <p>{header}</p>
      <p>{text}</p>
      <p>{created_at}</p>
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
