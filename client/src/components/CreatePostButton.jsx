import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Row, Col, Form, Button,
} from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { hideCommenter, showPoster } from '../slices/visabilitySlice';

function CreatePostButton() {
  const dispatch = useDispatch();

  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(hideCommenter());
    dispatch(showPoster());
  };

  return (
    <Form className="mt-4 pt-2" onSubmit={onSubmit}>
      <Row>
        <Col md="12">
          <div className="send d-grid">
            <Button type="submit">
              <Icon path={mdiPencil} title="Create post" size={1} />
              {' '}
              Create post
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
}

export default CreatePostButton;
