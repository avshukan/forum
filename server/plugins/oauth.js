const fp = require('fastify-plugin');
const oauthPlugin = require('@fastify/oauth2');

const { GOOGLE_ID, GOOGLE_SECRET, GOOGLE_CALLBACK_URI } = process.env;
const { GITHUB_ID, GITHUB_SECRET, GITHUB_CALLBACK_URI } = process.env;

module.exports = fp(async (fastify, _opts) => {
  // https://www.npmjs.com/package/@fastify/oauth2

  fastify.register(oauthPlugin, {
    name: 'googleOAuth2',
    credentials: {
      client: {
        id: GOOGLE_ID,
        secret: GOOGLE_SECRET,
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    scope: ['profile', 'email'],
    // register a fastify url to start the redirect flow
    startRedirectPath: '/auth/google/oauth2',
    // facebook redirect here after the user login
    // callbackUri: 'http://localhost:3000/login/facebook/callback',
    callbackUri: GOOGLE_CALLBACK_URI,
  });

  fastify.register(oauthPlugin, {
    name: 'facebookOAuth2',
    credentials: {
      client: {
        id: '<CLIENT_ID>',
        secret: '<CLIENT_SECRET>',
      },
      auth: oauthPlugin.FACEBOOK_CONFIGURATION,
    },
    scope: ['profile', 'email'],
    // register a fastify url to start the redirect flow
    startRedirectPath: '/login/facebook',
    // facebook redirect here after the user login
    callbackUri: 'http://localhost:3000/login/facebook/callback',
  });
});
