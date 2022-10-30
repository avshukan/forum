import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import Poster from './Poster';
import Posts from './Posts';
import { useAuth } from '../contexts/AuthProvider';
import fetchDataThunk from '../slices/fetchDataThunk';
import CreatePostButton from './CreatePostButton';

function Forum() {
  const dispatch = useDispatch();

  const { username } = useAuth();

  const visbilityPost = useSelector((store) => store.visability.poster);

  useEffect(() => {
    dispatch(fetchDataThunk(username));

    const intervalId = setInterval(() => {
      dispatch(fetchDataThunk(username));
    }, 5000);

    return () => clearInterval(intervalId);
  }, [username]);

  return (
    <Container className="container-sm h-100 my-4 rounded shadow">
      {/* <Container className="h-100 my-4 overflow-hidden rounded shadow"> */}
      <Row className="p-0 h-100">
        <Col className="p-0 h-100">
          <div className="d-flex flex-column h-100">
            {!visbilityPost && <CreatePostButton />}
            {visbilityPost && <Poster />}
            <Posts />
          </div>
        </Col>
      </Row>
      {/* <img src={logo} className="App-logo" alt="logo" /> */}
    </Container>
  );
}

export default Forum;
