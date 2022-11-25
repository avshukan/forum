class ReplyBuilder {
  constructor(statusCode = 200, payload = null) {
    this.statusCode = statusCode;
    this.payload = payload;
    this.headers = {};
  }

  code(value) {
    if (value === undefined) {
      return this.statusCode;
    }
    this.statusCode = value;
    return this;
  }

  header(key, value) {
    this.headers[key] = value;
  }

  send(value) {
    this.payload = value;
    return this;
  }
}

module.exports = ReplyBuilder;
