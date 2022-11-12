const { REACT_APP_API_URL, REACT_APP_API_BASE } = process.env;
const baseUrl = new URL(REACT_APP_API_URL, REACT_APP_API_BASE);

const header = (token) => ({
  'Content-Type': 'application/json;charset=utf-8',
  Authorization: `Bearer ${token}`,
});

export const login = (data) => {
  const { href } = new URL(['auth', 'login'].join('/'), baseUrl);
  return fetch(href, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data),
  });
};

export const signup = (data) => {
  const { href } = new URL(['auth', 'signup'].join('/'), baseUrl);
  return fetch(href, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data),
  });
};

export const getPosts = (token) => {
  const { href } = new URL('posts', baseUrl);
  return fetch(href, {
    headers: header(token),
  })
    .then((response) => response.json());
};

export const createPost = ({ token, ...data }) => {
  const { href } = new URL('posts', baseUrl);
  return fetch(href, {
    method: 'POST',
    headers: header(token),
    body: JSON.stringify(data),
  });
};

export const deletePost = ({ token, postId }) => {
  const { href } = new URL(['posts', postId].join('/'), baseUrl);
  return fetch(href, {
    method: 'DELETE',
    headers: header(token),
  });
};

export const createComment = ({ token, postId, ...data }) => {
  const { href } = new URL(['posts', postId, 'comments'].join('/'), baseUrl);
  return fetch(href, {
    method: 'POST',
    headers: header(token),
    body: JSON.stringify(data),
  });
};

export const deleteComment = ({ token, postId, commentId }) => {
  const { href } = new URL(['posts', postId, 'comments', commentId].join('/'), baseUrl);
  return fetch(href, {
    method: 'DELETE',
    headers: header(token),
  });
};
