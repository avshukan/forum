import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Post from './Post';

function Posts({ posts, refreshPosts }) {
  return (
    <>
      <hr />
      <div className="overflow-auto">
        {_.reverse(_.sortBy(posts, ['created_at'])).map((post) => <Post key={post.id} post={post} refreshPosts={refreshPosts} />)}
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
