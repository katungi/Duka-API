const expressjwt = require('express-jwt');

function authJwt() {
  const secret = process.env.secret;
  return expressjwt({
    secret,
    algorithms: ['HS256'],
  });
}

module.exports = authJwt;
