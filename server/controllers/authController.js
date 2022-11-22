const bcrypt = require('bcrypt');

const { FRONTEND_ORIGIN } = process.env;

async function signup(request, reply) {
  const { username, email, password } = request.body;

  try {
    const salt = bcrypt.genSaltSync();
    const passhash = bcrypt.hashSync(password, salt);
    const [id] = await this.db('users')
      .returning('id')
      .insert({
        username, email, salt, passhash,
      });
    const token = this.jwt.sign({ user: { id, username } });

    reply
      .code(201)
      .send({ token, id, username });

    return;
  } catch ({ message }) {
    this.log.error({ message });

    reply
      .code(500)
      .send({
        error: 'Server error',
        detail: message,
      });
  }
}

async function login(request, reply) {
  const { username, password } = request.body;

  try {
    const users = await this.db('users')
      .select('id', 'salt', 'passhash')
      .where('username', username);

    if (users.length === 0) {
      this.log.error({ message: `User "${username}" not found` });

      reply
        .code(404)
        .send({
          error: 'User not found',
          detail: { username },
        });

      return;
    }

    const [{ id, salt, passhash }] = users;
    if (passhash !== bcrypt.hashSync(password, salt)) {
      this.log.error({ message: `Wrong password for user "${username}"` });

      reply
        .code(401)
        .send({
          error: 'Wrong password',
          detail: { username },
        });

      return;
    }

    const token = this.jwt.sign({ user: { id, username } });

    reply
      .header('Access-Control-Allow-Origin', FRONTEND_ORIGIN);

    reply
      .setCookie('token', token, { path: '/' });

    reply
      .send({ id, username });

    return;
  } catch (error) {
    this.log.error({ error });

    reply
      .code(500)
      .send({
        error: 'Server error',
        detail: error.message,
      });
  }
}

module.exports = {
  signup,
  login,
};
