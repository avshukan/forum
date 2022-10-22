import React from 'react';
import PropTypes from 'prop-types';
import Post from './Post';

function Posts({ posts, refreshPosts }) {
  return (
    <>
      <hr />
      <div className="overflow-auto">
        {posts.map((post) => <Post post={post} refreshPosts={refreshPosts} />)}
      </div>
    </>
  );
}

Posts.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.func),
  refreshPosts: PropTypes.func,
};

Posts.defaultProps = {
  posts: [],
  refreshPosts: () => { },
};

export default Posts;
