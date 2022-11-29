const { REACT_APP_API_URL, REACT_APP_API_BASE } = process.env;
const baseUrl = new URL(REACT_APP_API_URL, REACT_APP_API_BASE);

const fetchOptions = (method = 'GET', data = null) => {
  const options = {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
  };
  if (data === null) {
    return options;
  }
  return { ...options, body: JSON.stringify(data) };
};

export const login = (data) => {
  const { href } = new URL(['auth', 'login'].join('/'), baseUrl);
  return fetch(href, fetchOptions('POST', data));
};

export const signup = (data) => {
  const { href } = new URL(['auth', 'signup'].join('/'), baseUrl);
  return fetch(href, fetchOptions('POST', data));
};

export const googleSigntoken = (data) => {
  const { href } = new URL(['auth', 'google', 'signtoken'].join('/'), baseUrl);
  return fetch(href, fetchOptions('POST', data));
};

export const getPosts = () => {
  const { href } = new URL('posts', baseUrl);
  return fetch(href, fetchOptions());
};

export const createPost = (data) => {
  const { href } = new URL('posts', baseUrl);
  return fetch(href, fetchOptions('POST', data));
};

export const deletePost = ({ postId }) => {
  const { href } = new URL(['posts', postId].join('/'), baseUrl);
  return fetch(href, fetchOptions('DELETE'));
};

export const createComment = ({ postId, ...data }) => {
  const { href } = new URL(['posts', postId, 'comments'].join('/'), baseUrl);
  return fetch(href, fetchOptions('POST', data));
};

export const deleteComment = ({ postId, commentId }) => {
  const { href } = new URL(['posts', postId, 'comments', commentId].join('/'), baseUrl);
  return fetch(href, fetchOptions('DELETE'));
};
