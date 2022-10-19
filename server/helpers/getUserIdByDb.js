const getUserIdByDb = (db) => async (username) => {
  const user = await db('users')
    .where('username', username)
    .first();

  if (user) {
    return user.id;
  }

  const newUser = await db('users')
    .returning('id')
    .insert({ username });

  return newUser[0].id;
};

module.exports = getUserIdByDb;
