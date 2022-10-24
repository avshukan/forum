import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
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
  };

  useEffect(() => {
    ref.current?.focus();
  }, [editMode]);

  const edit = (
    <Form onSubmit={onSubmit}>
      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">Set username:</InputGroup.Text>
        <Form.Control
          ref={ref}
          placeholder="Username"
          aria-label="Username"
          aria-describedby="basic-addon1"
          value={usernameValue}
          onChange={onChange}
        />
      </InputGroup>
    </Form>
  );

  return (
    editMode
      ? edit
      : button()
  );
}

export default LogButton;
