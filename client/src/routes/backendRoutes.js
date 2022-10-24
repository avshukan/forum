const url = 'api/v1/';
const base = 'http://localhost:5000/';
const baseUrl = new URL(url, base);
console.log('baseUrl', baseUrl);

const backendRoutes = {
  posts: (searchParams = {}) => {
    const resultUrl = new URL('posts', baseUrl);
    const params = resultUrl.searchParams;
    Object.entries(searchParams).forEach(([key, value]) => params.append(key, value));
    return resultUrl;
  },
  post: (postId) => new URL(['posts', postId].join('/'), baseUrl),
  comments: (postId) => new URL(['posts', postId, 'comments'].join('/'), baseUrl),
  comment: (postId, commentId) => new URL(['posts', postId, 'comments', commentId].join('/'), baseUrl),
};

export default backendRoutes;
