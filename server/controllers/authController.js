const yup = require('yup');
const bcrypt = require('bcrypt');

const { FRONTEND_ORIGIN } = process.env;

async function signup(request, reply) {
  const { username, email, password } = request.body;

  try {
    yup
      .object({
        username: yup.string()
          .required('username is required')
          .min(3, 'username length have to be betweeen 3 and 20')
          .max(20, 'username length have to be betweeen 3 and 20'),
        email: yup.string()
          .email()
          .required('email is required'),
        password: yup.string()
          .required('text is required')
          .min(6, 'min password length is 6')
          .max(100, 'max password length is 100'),
      })
      .validateSync({ username, email, password });
  } catch (error) {
    this.log.error({ message: error.errors });

    reply
      .code(400)
      .send({
        error: 'Bad data',
        detail: { message: error.errors },
      });

    return;
  }

  try {
    const users = await this.db('users')
      .where('username', username);

    if (users.length > 0) {
      this.log.error({ message: `User "${username}" already exists` });

      reply
        .code(409)
        .send({
          error: 'Conflict',
          detail: { message: 'username already exists', username },
        });

      return;
    }

    const salt = bcrypt.genSaltSync();
    const passhash = bcrypt.hashSync(password, salt);
    const [{ id }] = await this.db('users')
      .returning('id')
      .insert({
        username, email, salt, passhash,
      });
    const token = this.jwt.sign({ user: { id, username } });

    reply
      .header('Access-Control-Allow-Origin', FRONTEND_ORIGIN);

    reply
      .setCookie('token', token, { path: '/' });

    reply
      .code(201)
      .send({ id, username });

    return;
  } catch ({ message }) {
    this.log.error({ message });

    reply
      .code(500)
      .send({
        error: 'Server error',
        detail: { message },
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
  } catch ({ message }) {
    this.log.error({ message });

    reply
      .code(500)
      .send({
        error: 'Server error',
        detail: { message },
      });
  }
}

module.exports = {
  signup,
  login,
};
