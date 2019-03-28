const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = {
  callback: (req, res) => {
    const publicKey = fs.readFileSync(`${__dirname}/../../jwt_public_key`);
    // decrypt cookie
    jwt.verify(req.cookies.jwtAuth, publicKey, (err, data) => {
      // if error, send 500
      if (err) {
        res.status(500).redirect('http://localhost:3000');
        // else, send to site
      } else {
        req.session.user = data;
        res.redirect('http://localhost:3000');
      }
    });
  },
  login: (req, res, next) => {
    // If no cookie
    console.log(req.session.user)
    if (!req.cookies.jwtAuth) {
      return res.sendStatus(404);
    }
    // If cookie but no session
    if (req.cookies.jwtAuth && !req.session.user) {
      const publicKey = fs.readFileSync(`${__dirname}/../../jwt_public_key`);
      // decrypt cookie
      jwt.verify(req.cookies.jwtAuth, publicKey, (err, user) => {
        // If cookie valid
        if (!err) {
          req.session.user = user;
          let { roles }  = req.session.user;
          console.log('roles::::' , roles)
          roles = roles.map(role => role.role);
          // todo: ask about other potential roles
          // Check if user is just student
          const isStudent = roles.filter(role => role !== 'student').length === 0;
          // If student, set role on session to student
          if (isStudent) {
            req.session.user.role = 'student';
            // otherwise set to staff
          } else {
            req.session.user.role = 'staff';
          }
          // If cookie is invalid
        } else if (err.message === 'invalid token') {
          return res.sendStatus(400);
        }
      });
    }
    const { role, cohortId } = req.session.user;
    res.status(200).send({ role, cohortId });
  },
  // is Staff middlware
  isStaff: (req, res, next) => {
    if (req.session.user.role === 'staff') {
      next();
    } else {
      res.sendStatus(401);
    }
  },
  // is student middleware
  isStudent: (req, res, next) => {
    if (req.session.user.role === 'student' || req.session.user.role === 'staff') {
      next();
    } else {
      res.sendStatus(401);
    }
  },
};
