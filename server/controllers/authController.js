const bcrypt = require('bcrypt');

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
    console.log('id', id);
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

    const token = this.jwt.sign({ user: { id, username } });
    this.log.info({ token });

    reply
      .setCookie('token2', token, { path: '/' })
      // .setCookie('foo', 'foo', {
      //   domain: 'example.com',
      //   path: '/',
      // })
      .setCookie('a', 'a', {
        httpOnly: true,
      })
      .setCookie('a3000', 'a3000', {
        domain: 'localhost:3000',
        path: '/',
      })
      .setCookie('a5000', 'a5000', {
        domain: 'localhost:5000',
        path: '/',
      })
      .setCookie('l', 'l', {
        domain: '.localhost',
        path: '/',
      })
      // .setCookie('foo3', 'foo3', {
      //   domain: '127.0.0.1',
      //   path: '/',
      // })
      .cookie('baz', 'baz')
      // .setCookie('bar', 'bar', {
      //   path: '/',
      //   signed: true,
      // })
      // .setCookie('bar2', 'bar', { httpOnly: true })
      .send({ token, id, username });

    return;
  } catch (error) {
    reply
      .code(500)
      .send({
        error: 'server error',
        detail: error,
      });
  }
}

module.exports = {
  signup,
  login,
};
