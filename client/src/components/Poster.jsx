import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Container, Form, Button, InputGroup,
} from 'react-bootstrap';
import backendRoutes from '../routes/backendRoutes';
import { useAuth } from '../contexts/AuthProvider';

function Poster({ refreshPosts }) {
  const { username } = useAuth();

  const [header, setHeader] = useState('');

  const [text, setText] = useState('');

  const canPost = () => !!username;

  const onChangeHeader = (event) => {
    setHeader(event.target.value);
  };

  const onChangeText = (event) => {
    setText(event.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!canPost()) {
      return;
    }

    const response = await fetch(backendRoutes.posts().href, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ username, header, text }),
    });
    if (response.status === 201) {
      setHeader('');
      setText('');
    }
    const result = await response.json();
    console.log('response.status', response.status);
    console.log('result', result);

    await refreshPosts();
  };

  return (
    <Container style={{ textAlign: 'right' }}>
      <Form onSubmit={onSubmit}>
        <InputGroup className="mb-3">
          <InputGroup.Text id="header">Set post header:</InputGroup.Text>
          <Form.Control
            placeholder="header"
            aria-label="header"
            aria-describedby="header"
            value={header}
            onChange={onChangeHeader}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Type your post...</InputGroup.Text>
          <Form.Control
            as="textarea"
            aria-label="Text"
            rows={3}
            value={text}
            onChange={onChangeText}
          />
        </InputGroup>
        <Button variant="primary" type="submit" className="ml-auto" disabled={!canPost()}>Send</Button>
      </Form>
    </Container>
  );
}

Poster.propTypes = {
  refreshPosts: PropTypes.func,
};

Poster.defaultProps = () => { };

export default Poster;
