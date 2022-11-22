const bcrypt = require('bcrypt');

const { FRONTEND_ORIGIN } = process.env;

async function signup(request, reply) {
  this.log.info({ msg: 'signup controller' });
  const { username, email, password } = request.body;
  try {
    const salt = bcrypt.genSaltSync();
    const passhash = bcrypt.hashSync(password, salt);
    const [id] = await this.db('users')
      .returning('id')
      .insert({
        username, email, salt, passhash,
      });
    this.log.info({ id });
    const token = this.jwt.sign({ user: { id, username } });
    this.log.info({ token });
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
      reply
        .code(401)
        .send({
          error: 'Wrong password',
          detail: { username },
        });

      return;
    }

    this.log.info({ message: 'user and pass are good' });
    const token = this.jwt.sign({ user: { id, username } });
    this.log.info({ token });
    reply.header('Access-Control-Allow-Origin', FRONTEND_ORIGIN);
    this.log.info({ message: 'header Access-Control-Allow-Origin' });
    reply.setCookie('token', token, { path: '/' });
    this.log.info({ message: 'set cookie token' });
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
