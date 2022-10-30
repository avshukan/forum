import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { Button, Form } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthProvider';

function LogButton() {
  const { username, logIn, logOut } = useAuth();

  const ref = useRef();

  const [usernameValue, setUsernameValue] = useState('');

  const [editMode, setEditMode] = useState(false);

  const onLogInClick = () => setEditMode(true);

  const logOutButton = <Button onClick={() => logOut()}>LogOut</Button>;

  const logInButton = <Button onClick={onLogInClick}>LogIn</Button>;

  const button = useCallback(() => (username ? logOutButton : logInButton), [username]);

  const onChange = (event) => {
    event.preventDefault();
    setUsernameValue(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    logIn(usernameValue);
    setEditMode(false);
    setUsernameValue('');
  };

  useEffect(() => {
    ref.current?.focus();
  }, [editMode]);

  const edit = (
    <Form onSubmit={onSubmit}>
      <Form.Label htmlFor="username" visuallyHidden>Header</Form.Label>
      <Form.Control
        ref={ref}
        id="username"
        placeholder="Username"
        aria-label="username"
        aria-describedby="username"
        required=""
        value={usernameValue}
        onChange={onChange}
      />
    </Form>
  );

  return (
    editMode
      ? edit
      : button()
  );
}

export default LogButton;
