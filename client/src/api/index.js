const url = 'api/v1/';
const base = 'http://localhost:5000/';
const baseUrl = new URL(url, base);

export const getPosts = (username) => {
  const resultUrl = new URL('posts', baseUrl);
  const params = resultUrl.searchParams;
  params.append('username', username);
  const { href } = resultUrl;
  return fetch(href)
    .then((response) => response.json())
    .catch((error) => console.log(error));
};

export const createPost = (data) => {
  const { href } = new URL('posts', baseUrl);
  return fetch(href, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data),
  })
    .catch((error) => console.log(error));
};

export const deletePost = ({ username, postId }) => {
  const { href } = new URL(['posts', postId].join('/'), baseUrl);
  return fetch(href, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ username }),
  })
    .catch((error) => console.log(error));
};

export const createComment = (data) => {
  const { postId } = data;
  const { href } = new URL(['posts', postId, 'comments'].join('/'), baseUrl);
  return fetch(href, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data),
  })
    .catch((error) => console.log(error));
};

export const deleteComment = ({ username, postId, commentId }) => {
  const { href } = new URL(['posts', postId, 'comments', commentId].join('/'), baseUrl);
  return fetch(href, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ username }),
  })
    .catch((error) => console.log(error));
};
