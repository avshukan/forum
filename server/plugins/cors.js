const fp = require('fastify-plugin');
const cors = require('@fastify/cors');

const { CORS_HOSTNAME } = process.env;

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(async (fastify, _opts) => {
  fastify.register(cors, {
    origin: (origin, cb) => {
      const { hostname } = new URL(origin);
      if (hostname === CORS_HOSTNAME) {
        //  Request from CORS_HOSTNAME will pass
        cb(null, true);
        return;
      }
      // Generate an error on other origins, disabling access
      cb(new Error('Not allowed'), false);
    },
  });
});
