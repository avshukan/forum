import React from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import Post from './Post';

function Posts() {
  const { posts } = useSelector((state) => state.data);

  return (
    <div className="card rounded-0 border-0 p-4">
      <ul className="list-unstyled mt-4 pt-2 mb-0">
        {_.reverse(_.sortBy(posts, ['created_at'])).map((post) => <Post key={post.id} post={post} />)}
      </ul>
    </div>
  );
}

export default Posts;
