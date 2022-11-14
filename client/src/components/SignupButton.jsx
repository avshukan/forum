import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function SignupButton() {
  const navigate = useNavigate();

  const onClick = () => {
    navigate('/signup');
  };

  return <Button onClick={onClick}>Signup</Button>;
}

export default SignupButton;
