import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Poster from './Poster';
import Posts from './Posts';

function Forum() {
  const [state, setState] = useState({ posts: [] });

  const refreshPosts = async () => {
    const response = await fetch('http://localhost:5000/api/v1/posts?username=Alice');
    const posts = await response.json();
    console.log('response.status', response.status);
    console.log('posts', posts);
    setState({ ...state, posts });
    return posts;
  };

  useEffect(() => {
    refreshPosts();
  }, []);

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="p-0 h-100">
        <Col className="p-0 h-100">
          <div className="d-flex flex-column h-100">
            <Poster refreshPosts={refreshPosts} />
            <Posts posts={state.posts} refreshPosts={refreshPosts} />
          </div>
        </Col>
      </Row>
      {/* <img src={logo} className="App-logo" alt="logo" /> */}
    </Container>
  );
}

export default Forum;
