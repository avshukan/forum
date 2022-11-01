import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Poster from './Poster';
import Posts from './Posts';
import { useAuth } from '../contexts/AuthProvider';
import fetchDataThunk from '../slices/fetchDataThunk';

function Forum() {
  const dispatch = useDispatch();

  const { username } = useAuth();

  const visbilityPost = useSelector((store) => store.visability.poster);

  useEffect(() => {
    dispatch(fetchDataThunk(username));

    const intervalId = setInterval(() => {
      dispatch(fetchDataThunk(username));
    }, 5000);

    return () => clearInterval(intervalId);
  }, [username]);

  return (
    <>
      {visbilityPost && <Poster />}
      <Posts />
    </>
  );
}

export default Forum;
