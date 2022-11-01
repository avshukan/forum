import React from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { Container, Row, Col } from 'react-bootstrap';
import Post from './Post';

function Posts() {
  const { posts } = useSelector((state) => state.data);

  return (
    <Container className="h-100 rounded shadow">
      <Row className="p-0 h-100">
        <Col className="p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="card rounded-0 border-0 p-4">
              <ul className="list-unstyled mt-4 pt-2 mb-0">
                {_.reverse(_.sortBy(posts, ['created_at'])).map((post) => <Post key={post.id} post={post} />)}
              </ul>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Posts;
