const fp = require('fastify-plugin');
const oauthPlugin = require('@fastify/oauth2');

module.exports = fp(async (fastify, _opts) => {
  // https://www.npmjs.com/package/@fastify/oauth2
  fastify.register(oauthPlugin, {
    name: 'facebookOAuth2',
    credentials: {
      client: {
        id: '<CLIENT_ID>',
        secret: '<CLIENT_SECRET>',
      },
      auth: oauthPlugin.FACEBOOK_CONFIGURATION,
    },
    // register a fastify url to start the redirect flow
    startRedirectPath: '/login/facebook',
    // facebook redirect here after the user login
    callbackUri: 'http://localhost:3000/login/facebook/callback',
  });
});
