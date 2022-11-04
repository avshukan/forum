const { REACT_APP_API_URL, REACT_APP_API_BASE } = process.env;
const baseUrl = new URL(REACT_APP_API_URL, REACT_APP_API_BASE);

const headers = {
  'Content-Type': 'application/json;charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Headers': 'Authorization, Origin, X-Requested-With, Accept, X-PINGOTHER, Content-Type',
};

export const getPosts = (username) => {
  const resultUrl = new URL('posts', baseUrl);
  const params = resultUrl.searchParams;
  params.append('username', username);
  const { href } = resultUrl;
  return fetch(href, headers)
    .then((response) => response.json())
    .catch((error) => console.log(error));
};

export const createPost = (data) => {
  const { href } = new URL('posts', baseUrl);
  return fetch(href, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })
    .catch((error) => console.log(error));
};

export const deletePost = ({ username, postId }) => {
  const { href } = new URL(['posts', postId].join('/'), baseUrl);
  return fetch(href, {
    method: 'DELETE',
    headers,
    body: JSON.stringify({ username }),
  })
    .catch((error) => console.log(error));
};

export const createComment = (data) => {
  const { postId } = data;
  const { href } = new URL(['posts', postId, 'comments'].join('/'), baseUrl);
  return fetch(href, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })
    .catch((error) => console.log(error));
};

export const deleteComment = ({ username, postId, commentId }) => {
  const { href } = new URL(['posts', postId, 'comments', commentId].join('/'), baseUrl);
  return fetch(href, {
    method: 'DELETE',
    headers,
    body: JSON.stringify({ username }),
  })
    .catch((error) => console.log(error));
};
