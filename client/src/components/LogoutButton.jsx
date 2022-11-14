import React from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../slices/userSlice';

function LogoutButton() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const onClick = () => {
    dispatch(logout());
    navigate('/');
  };

  return <Button onClick={onClick}>Logout</Button>;
}

export default LogoutButton;
