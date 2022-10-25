import React from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import Post from './Post';

function Posts() {
  const { posts } = useSelector((state) => state.data);

  return (
    <>
      <hr />
      <div style={{ overflowX: 'hidden', overflowY: 'auto' }}>
        {_.reverse(_.sortBy(posts, ['created_at'])).map((post) => <Post key={post.id} post={post} />)}
      </div>
    </>
  );
}

export default Posts;
