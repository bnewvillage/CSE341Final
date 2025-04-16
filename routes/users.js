const router = require('express').Router();
const usersController = require('../controllers/users');

router.get('/', usersController.getAdmins);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;