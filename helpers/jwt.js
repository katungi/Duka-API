const expressjwt = require('express-jwt');

function authJwt() {
  const secret = process.env.secret;
  const api = process.env.API_URL;

  return expressjwt({
    secret,
    algorithms: ['HS256'],
  }).unless({
    path: [
      { url: `${api}/products`, methods: ['GET', 'OPTIONS'] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

module.exports = authJwt;
