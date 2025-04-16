const router = require('express').Router();
const passport = require('passport');

router.use('/projects', require('./projects'));
router.use('/users', require('./users'));
router.use('/tasks', require('./tasks'));

module.exports = router;