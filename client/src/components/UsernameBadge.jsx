import React from 'react';
import { Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthProvider';

function UsernameBadge() {
  const { username } = useAuth();

  const text = () => (username || 'Unknown!!');

  const bg = () => (username ? 'primary' : 'danger');

  return <Badge bg={bg()} style={{ fontSize: '1.25rem', marginLeft: '1rem', mareginRight: '1rem' }}>{text()}</Badge>;
}

export default UsernameBadge;
