class ReplyBuilder {
    constructor(statusCode = 200, payload = null) {
        this.statusCode = statusCode;
        this.payload = payload;
    }

    code(value) {
        if (value === undefined) {
            return this.statusCode;
        }
        this.statusCode = value;
        return this;
    };

    send(value) {
        this.payload = value;
        return this;
    }
};

module.exports = { ReplyBuilder };
