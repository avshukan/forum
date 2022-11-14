import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LoginButton() {
  const navigate = useNavigate();

  const onClick = () => {
    navigate('/login');
  };

  return <Button onClick={onClick}>Login</Button>;
}

export default LoginButton;
