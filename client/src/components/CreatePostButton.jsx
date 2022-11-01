import React from 'react';
import { useDispatch } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
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
    <Form onSubmit={onSubmit}>
      <Button type="submit">
        <Icon path={mdiPencil} title="Create post" size={1} />
        {' Create post'}
      </Button>
    </Form>
  );
}

export default CreatePostButton;
