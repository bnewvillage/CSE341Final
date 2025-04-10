const router = require('express').Router();
const usersController = require('../controllers/users');

router.get('/', usersController.getAdmins);

module.exports = router;