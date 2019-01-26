const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = {
  callback: (req, res) => {
    const publicKey = fs.readFileSync(`${__dirname}/../../jwt_public_key`);
    jwt.verify(req.cookies.jwtAuth, publicKey, (err, data) => {
      if (err) {
        res.status(500).redirect('http://localhost:3000');
      } else {
        req.session.user = data;
        res.redirect('http://localhost:3000');
      }
    });
  },
  login: (req, res, next) => {
    if (!req.cookies.jwtAuth) {
      return res.sendStatus(404);
    }
    if (req.cookies.jwtAuth && !req.session.user) {
      const publicKey = fs.readFileSync(`${__dirname}/../../jwt_public_key`);
      jwt.verify(req.cookies.jwtAuth, publicKey, (err, user) => {
        if (!err) {
          req.session.user = user;
          let { roles } = req.session.user;
          roles = roles.map(role => role.role);
          // todo: ask about other potential roles
          const isStudent = roles.filter(role => role !== 'student').length === 0;
          if (isStudent) {
            req.session.user.role = 'student';
          } else {
            req.session.user.role = 'staff';
          }
        } else if (err.message === 'invalid token') {
          return res.sendStatus(400);
        }
      });
    }
    const { role, cohortId } = req.session.user;
    res.status(200).send({ role, cohortId });
  },
  isStaff: (req, res, next) => {
    if (req.session.user.role === 'staff') {
      next();
    } else {
      res.sendStatus(401);
    }
  },
  isStudent: (req, res, next) => {
    if (req.session.user.role === 'student' || req.session.user.role === 'staff') {
      next();
    } else {
      res.sendStatus(401);
    }
  },
};
