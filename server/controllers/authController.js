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

    this.log.info({ message: 'user and pass are good' });

    const token = this.jwt.sign({ user: { id, username } });
    this.log.info({ token });

    // Website you wish to allow to connect
    reply.header('Access-Control-Allow-Origin', '*');
    this.log.info({ message: 'header Access-Control-Allow-Origin' });
    // Request methods you wish to allow
    reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    this.log.info({ message: 'header Access-Control-Allow-Methods' });
    // Request headers you wish to allow
    reply.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,content-type,set-cookie');
    this.log.info({ message: 'header Access-Control-Allow-Headers' });
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // reply.header('Access-Control-Allow-Credentials', true);
    reply.header('Content-Type', 'application/json; charset=utf-8');
    this.log.info({ message: 'header Content-Type' });

    this.log.info({ message: 'before cookie' });
    reply.header('set-cookie', 'token=token');
    reply.header('set-cookie', 'token12=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo1LCJ1c2VybmFtZSI6IkFsaWNlIn0sImlhdCI6MTY2ODg0NDM4M30.k5QaMVal7_hmEI681EbnQX_LJUucimcTO6jtVJO8GHg; Domain=http://localhost; Path=/');
    /*
        reply
          .setCookie('token01', token, { path: '/' })
          .setCookie('token02', token, { domain: 'http://localhost:5000', path: '/' })
          .setCookie('token03', token, { domain: 'http://localhost:5000/', path: '/' })
          .setCookie('token04', token, { domain: 'http://localhost:3000', path: '/' })
          .setCookie('token05', token, { domain: 'http://localhost:3000/', path: '/' })
          .setCookie('token06', token, { domain: 'http://127.0.0.1:5000', path: '/' })
          .setCookie('token07', token, { domain: 'http://127.0.0.1:5000/', path: '/' })
          .setCookie('token08', token, { domain: 'http://127.0.0.1:3000', path: '/' })
          .setCookie('token09', token, { domain: 'http://127.0.0.1:3000/', path: '/' })

          .setCookie('token12', token, { domain: 'http://localhost', path: '/' })
          .setCookie('token13', token, { domain: 'http://localhost/', path: '/' })
          .setCookie('token14', token, { domain: 'http://localhost', path: '/' })
          .setCookie('token15', token, { domain: 'http://localhost/', path: '/' })
          .setCookie('token16', token, { domain: 'http://127.0.0.1', path: '/' })
          .setCookie('token17', token, { domain: 'http://127.0.0.1/', path: '/' })
          .setCookie('token18', token, { domain: 'http://127.0.0.1', path: '/' })
          .setCookie('token19', token, { domain: 'http://127.0.0.1/', path: '/' })

          .setCookie('token21', token, { domain: 'forum.avshukan.ru', path: '/' })
          .setCookie('token22', token, { domain: 'forum-api.avshukan.ru', path: '/' })
          .setCookie('token23', token, { domain: 'http://forum.avshukan.ru', path: '/' })
          .setCookie('token24', token, { domain: 'http://forum-api.avshukan.ru', path: '/' })
          .setCookie('token25', token, { domain: 'http://forum.avshukan.ru:3000', path: '/' })
          .setCookie('token26', token, { domain: 'http://forum-api.avshukan.ru:3000', path: '/' })
          .setCookie('token27', token, { domain: 'http://forum.avshukan.ru:5000', path: '/' })
          .setCookie('token28', token, { domain: 'http://forum-api.avshukan.ru:5000', path: '/' })

          .setCookie('token31', token, { domain: 'forum.avshukan.ru/', path: '/' })
          .setCookie('token32', token, { domain: 'forum-api.avshukan.ru/', path: '/' })
          .setCookie('token33', token, { domain: 'http://forum.avshukan.ru/', path: '/' })
          .setCookie('token34', token, { domain: 'http://forum-api.avshukan.ru/', path: '/' })
          .setCookie('token35', token, { domain: 'http://forum.avshukan.ru:3000/', path: '/' })
          .setCookie('token36', token, { domain: 'http://forum-api.avshukan.ru:3000/', path: '/' })
          .setCookie('token37', token, { domain: 'http://forum.avshukan.ru:5000/', path: '/' })
          .setCookie('token38', token, { domain: 'http://forum-api.avshukan.ru:5000/', path: '/' })
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
          .cookie('baz', 'baz');
    */

    this.log.info({ message: 'before send' });

    reply
      .send({ token, id, username });

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
