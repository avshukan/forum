import React from 'react';
import { Container, Form, InputGroup } from 'react-bootstrap';

function Poster() {
  return (
    <Container>
      <Form>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Set username:</InputGroup.Text>
          <Form.Control
            placeholder="Username"
            aria-label="Username"
            aria-describedby="basic-addon1"
          // value={usernameValue}
          // onChange={onChange}
          />
        </InputGroup>
      </Form>
    </Container>
  );
}

export default Poster;
