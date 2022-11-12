const { REACT_APP_API_URL, REACT_APP_API_BASE } = process.env;
const baseUrl = new URL(REACT_APP_API_URL, REACT_APP_API_BASE);

const headers = { 'Content-Type': 'application/json;charset=utf-8' };

export const login = ({ username, password }) => {
  console.log('api username, password', username, password);
  const { href } = new URL(['auth', 'login'].join('/'), baseUrl);
  return fetch(href, {
    method: 'POST',
    headers,
    body: JSON.stringify({ username, password }),
  });
};

export const signup = ({ username, email, password }) => {
  const { href } = new URL(['auth', 'signup'].join('/'), baseUrl);
  return fetch(href, {
    method: 'POST',
    headers,
    body: JSON.stringify({ username, email, password }),
  });
};

export const getPosts = (username) => {
  const resultUrl = new URL('posts', baseUrl);
  const params = resultUrl.searchParams;
  params.append('username', username);
  const { href } = resultUrl;
  return fetch(href, headers)
    .then((response) => response.json());
};

export const createPost = (token, data) => {
  const { href } = new URL('posts', baseUrl);
  return fetch(href, {
    method: 'POST',
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

export const deletePost = ({ username, postId }) => {
  const { href } = new URL(['posts', postId].join('/'), baseUrl);
  return fetch(href, {
    method: 'DELETE',
    headers,
    body: JSON.stringify({ username }),
  });
};

export const createComment = (data) => {
  const { postId } = data;
  const { href } = new URL(['posts', postId, 'comments'].join('/'), baseUrl);
  return fetch(href, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
};

export const deleteComment = ({ username, postId, commentId }) => {
  const { href } = new URL(['posts', postId, 'comments', commentId].join('/'), baseUrl);
  return fetch(href, {
    method: 'DELETE',
    headers,
    body: JSON.stringify({ username }),
  });
};
