function signup(_request, reply) {
  console.log('signup controller');
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
