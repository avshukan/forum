import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import Post from './Post';
import fetchDataThunk from '../slices/fetchDataThunk';
import { useAuth } from '../contexts/AuthProvider';

function Posts() {
  const dispatch = useDispatch();

  const { username } = useAuth();

  const { posts } = useSelector((state) => state.data);

  return (
    <>
      <hr />
      <div style={{ overflowX: 'hidden', overflowY: 'auto' }}>
        {_.reverse(_.sortBy(posts, ['created_at'])).map((post) => <Post key={post.id} post={post} refreshPosts={() => dispatch(fetchDataThunk({ username }))} />)}
      </div>
    </>
  );
}

export default Posts;
