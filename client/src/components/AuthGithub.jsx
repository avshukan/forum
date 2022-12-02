import React from 'react';
import { FaGithub } from 'react-icons/fa';

const { REACT_APP_GITHUB_ID } = process.env;

function AuthGithub() {
  const url = new URL('/login/oauth/authorize', 'https://github.com');
  url.searchParams.set('client_id', REACT_APP_GITHUB_ID);

  return (
    <div className="text-center my-3">
      <a href={url.href} className="btn btn-light" role="button">
        <div className="d-inline-flex p-2 me-2">
          <FaGithub />
        </div>
        <span className="p-2">Login with Github</span>
      </a>
    </div>
  );
}

export default AuthGithub;
