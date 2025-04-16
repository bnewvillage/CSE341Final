const router = require('express').Router();
const passport = require('passport');

router.use('/projects', require('./projects'));
router.use('/users', require('./users'));
router.use('/tasks', require('./tasks'));

router.post('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});

module.exports = router;