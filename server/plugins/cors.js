const fp = require('fastify-plugin');
const cors = require('@fastify/cors');

const { FRONTEND_ORIGIN } = process.env;
const { protocol: frontendProtocol, hostname: frontendHostname, port: frontendPort } = new URL(FRONTEND_ORIGIN);

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope
module.exports = fp(async (fastify, _opts) => {
  fastify.register(cors, {
    origin: (origin, cb) => {
      const { protocol, hostname, port } = new URL(origin);
      if (protocol === frontendProtocol && hostname === frontendHostname && port === frontendPort) {
        //  Request will pass
        cb(null, true);
        return;
      }
      // Generate an error on other origins, disabling access
      cb(new Error('Not allowed'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'DELETE'],
  });
});
