const cors = require('@fastify/cors');
const path = require('path');
const AutoLoad = require('@fastify/autoload');

const { CORS_HOSTNAME } = process.env;

async function app(fastify, opts) {
  // Place here your custom code!

  await fastify.register(cors, {
    origin: (origin, cb) => {
      const { hostname } = new URL(origin);
      if (hostname === CORS_HOSTNAME) {
        //  Request from localhost will pass
        cb(null, true);
        return;
      }
      // Generate an error on other origins, disabling access
      cb(new Error('Not allowed'), false);
    },
  });

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: { ...opts },
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: { prefix: '/api/v1', ...opts },
  });
}

module.exports = app;
