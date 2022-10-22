const getUsernameById = (users, userId) => {
  const [user] = users.filter(({ id }) => id === userId);
  const { username } = user;
  return username;
};

module.exports = getUsernameById;
