const getPictureById = (users, userId) => {
  const [user] = users.filter(({ id }) => id === userId);
  const { picture_url: picture } = user;
  return picture;
};

module.exports = getPictureById;
