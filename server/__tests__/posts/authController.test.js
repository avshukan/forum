const _ = require('lodash');
const knex = require('knex');
const knexfile = require('../../knexfile');
const getTablesLengthChecker = require('../../helpers/getTablesLengthChecker');
const ReplyBuilder = require('../../helpers/ReplyBuilder');
const { signup, login } = require('../../controllers/authController');

const app = {};
const sign = (value) => JSON.stringify(value);

const signupHandler = async ({
  username, email, password, expectedStatusCode, expectedHeaders, expectedPayload,
  usersDelta = 0,
  postsDelta = 0,
  commentsDelta = 0,
}) => {
  const tablesLengthChecker = await getTablesLengthChecker(app.db);

  const request = { body: { username, email, password } };
  const reply = new ReplyBuilder();
  await signup.call(app, request, reply);

  const { statusCode, payload, headers } = reply;
  expect(statusCode).toBe(expectedStatusCode);
  expect(headers).toEqual(expect.arrayContaining(expectedHeaders));
  expect(payload).toMatchObject(expectedPayload);

  await tablesLengthChecker(app.db, { usersDelta, postsDelta, commentsDelta });
};

const loginHandler = async ({
  username, password, expectedStatusCode, expectedHeaders, expectedPayload,
}) => {
  const tablesLengthChecker = await getTablesLengthChecker(app.db);

  const request = { body: { username, password } };
  const reply = new ReplyBuilder();
  await login.call(app, request, reply);

  const { statusCode, payload, headers } = reply;
  expect(statusCode).toBe(expectedStatusCode);
  expect(headers).toEqual(expect.arrayContaining(expectedHeaders));
  expect(payload).toMatchObject(expectedPayload);

  await tablesLengthChecker(app.db, { usersDelta: 0, postsDelta: 0, commentsDelta: 0 });
};

const signupCases = [
  {
    name: 'good case: new known user',
    username: 'Helen',
    email: 'helen@example.com',
    password: 'qweasd',
    expectedStatusCode: 201,
    expectedHeaders: [['set-Cookie', 'token={"user":{"id":5,"username":"Helen"}}']],
    expectedPayload: { id: 5, username: 'Helen' },
    usersDelta: 1,
  },
  {
    name: 'bad case: username already exists',
    username: 'Alice',
    email: 'helen@example.com',
    password: 'qweasd',
    expectedStatusCode: 409,
    expectedHeaders: [],
    expectedPayload: { detail: { message: 'username already exists', username: 'Alice' }, error: 'Conflict' },
    usersDelta: 0,
  },
  {
    name: 'bad case: empty username',
    username: '',
    email: 'helen@example.com',
    password: 'qweasd',
    expectedStatusCode: 400,
    expectedHeaders: [],
    expectedPayload: { detail: { message: ['username is required'] }, error: 'Bad data' },
  },
  {
    name: 'bad case: short username',
    username: 'Q',
    email: 'helen@example.com',
    password: 'qweasd',
    expectedStatusCode: 400,
    expectedHeaders: [],
    expectedPayload: { detail: { message: ['username length have to be betweeen 3 and 20'] }, error: 'Bad data' },
  },
  {
    name: 'bad case: long username',
    username: 'Very_vary_vary_vary_vary_long_name',
    email: 'helen@example.com',
    password: 'qweasd',
    expectedStatusCode: 400,
    expectedHeaders: [],
    expectedPayload: { detail: { message: ['username length have to be betweeen 3 and 20'] }, error: 'Bad data' },
  },
  {
    name: 'bad case: email is required',
    username: 'Helen',
    password: 'qweasd',
    expectedStatusCode: 400,
    expectedHeaders: [],
    expectedPayload: { detail: { message: ['email is required'] }, error: 'Bad data' },
  },
  {
    name: 'bad case: bad email',
    username: 'Helen',
    email: 'helen_example_com',
    password: 'qweasd',
    expectedStatusCode: 400,
    expectedHeaders: [],
    expectedPayload: { detail: { message: ['email must be a valid email'] }, error: 'Bad data' },
  },
  {
    name: 'bad case: short password',
    username: 'Helen',
    email: 'helen@example.com',
    password: 'qwe',
    expectedStatusCode: 400,
    expectedHeaders: [],
    expectedPayload: { detail: { message: ['min password length is 6'] }, error: 'Bad data' },
  },
  {
    name: 'bad case: long password',
    username: 'Helen',
    email: 'helen@example.com',
    password: 'qwe'.repeat(100),
    expectedStatusCode: 400,
    expectedHeaders: [],
    expectedPayload: { detail: { message: ['max password length is 100'] }, error: 'Bad data' },
  },
];

const loginCases = [
  {
    name: 'good case: right known user',
    username: 'Alice',
    password: 'qweasd',
    expectedStatusCode: 200,
    expectedHeaders: [['set-Cookie', 'token={"user":{"id":1,"username":"Alice"}}']],
    expectedPayload: { id: 1, username: 'Alice' },
  },
  {
    name: 'bad case: wrong password',
    username: 'Alice',
    password: 'qweasd2',
    expectedStatusCode: 401,
    expectedHeaders: [],
    expectedPayload: { detail: { username: 'Alice' }, error: 'Wrong password' },
  },
  {
    name: 'bad case: unknown user',
    username: 'Zendaya',
    password: 'qweasd',
    expectedStatusCode: 404,
    expectedHeaders: [],
    expectedPayload: { detail: { username: 'Zendaya' }, error: 'User not found' },
  },
];

beforeEach(async () => {
  const db = knex(knexfile.test);
  await db.migrate.latest();
  await db.seed.run();
  app.db = db;
  const log = {
    error: (message) => console.log(message),
    info: () => { },
  };
  app.log = log;
  app.jwt = { sign };
}, 60000);

describe('authController', () => {
  describe('signup', () => {
    test.each(signupCases)('$name', signupHandler, 60000);

    it('bad case: server error', async () => {
      app.db = () => new Proxy({}, {
        get() { throw new Error('test error'); },
      });

      const request = {
        body: {
          username: 'Helen',
          email: 'helen@example.com',
          password: 'qweasd',
        },
      };

      const reply = new ReplyBuilder();
      await signup.call(app, request, reply);

      const { statusCode, payload } = reply;
      expect(statusCode).toBe(500);
      expect(payload.error).toBe('Server error');
      expect(payload.detail.message).toBe('test error');
    }, 60000);
  });

  describe('login', () => {
    test.each(loginCases)('$name', loginHandler, 60000);

    it('bad case: server error', async () => {
      app.db = () => new Proxy({}, {
        get() { throw new Error('test error'); },
      });

      const request = {
        body: {
          username: 'Helen',
          email: 'helen@example.com',
          password: 'qweasd',
        },
      };

      const reply = new ReplyBuilder();
      await login.call(app, request, reply);

      const { statusCode, payload } = reply;
      expect(statusCode).toBe(500);
      expect(payload.error).toBe('Server error');
      expect(payload.detail.message).toBe('test error');
    }, 60000);
  });
});
