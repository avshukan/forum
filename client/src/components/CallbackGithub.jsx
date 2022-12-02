import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import githubThunk from '../slices/githubThunk';
import Title from './Title';

function CallbackGithub() {
  const dispatch = useDispatch();

  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (!searchParams.has('code')) return;

    const code = searchParams.get('code');
    dispatch(githubThunk({ code }));
    // const response = dispatch(loginThunk({ username, password }));
    // if (response.status === 201) {
    //   do something
    // }
    navigate('/');
  });

  return <Title text="Идёт создание профиля" />;
}

export default CallbackGithub;
