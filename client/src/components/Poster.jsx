import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Container, Form, Button, InputGroup,
} from 'react-bootstrap';
import { useAuth } from '../contexts/AuthProvider';

function Poster({ refreshPosts }) {
  const { username } = useAuth();

  const [header, setHeader] = useState('');

  const [text, setText] = useState('');

  const onChangeHeader = (event) => {
    setHeader(event.target.value);
  };

  const onChangeText = (event) => {
    setText(event.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('http://localhost:5000/api/v1/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ username, header, text }),
    });
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
        <Button variant="primary" type="submit" className="ml-auto">Send</Button>
      </Form>
    </Container>
  );
}

Poster.propTypes = {
  refreshPosts: PropTypes.func,
};

Poster.defaultProps = () => { };

export default Poster;
