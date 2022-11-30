import React from 'react';

const { REACT_APP_GITHUB_ID } = process.env;

function AuthGithub() {
  const url = new URL('/login/oauth/authorize', 'https://github.com');
  url.searchParams.set('client_id', REACT_APP_GITHUB_ID);

  return (
    <div className="text-center">
      <a href={url.href}>Login with Github</a>
    </div>
  );
}

export default AuthGithub;
