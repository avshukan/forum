const { OAuth2Client } = require('google-auth-library');

const { GOOGLE_ID } = process.env;

const client = new OAuth2Client(GOOGLE_ID);

async function verifyGoogleToken(googleToken) {
  const ticket = await client.verifyIdToken({
    idToken: googleToken,
    audience: GOOGLE_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    // [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  const payload = ticket.getPayload();

  return {
    googleId: payload.sub,
    username: payload.name,
    email: payload.email,
    picture: payload.picture,
  };
}

module.exports = verifyGoogleToken;
