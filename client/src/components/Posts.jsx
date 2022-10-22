import React from 'react';
import PropTypes from 'prop-types';

function Posts({ posts }) {
  return (
    <>
      <hr />
      <div className="overflow-auto">
        {posts.map((post) => <div className="m-4 p-4">{post.text}</div>)}
      </div>
    </>
  );
}

Posts.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.func),
};

Posts.defaultProps = [];

export default Posts;
