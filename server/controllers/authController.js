function signup(request, reply) {
  console.log('signup controller');
  const {
    username, email, password, passwordConfirmation,
  } = request.body;
  try {
    const payload = 'xxx';
    const token = this.jwt.sign({ payload });
    this.log.info({ token });
    reply.send({ token });
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

function login(request, reply) {
  console.log('signup controller');
  const { username, password } = request.body;
  try {
    const payload = 'xxx';
    const token = this.jwt.sign({ payload });
    this.log.info({ token });
    reply.send({ token });
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
};
