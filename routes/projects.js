const router = require('express').Router();
const projectsController = require('../controllers/projects');

router.get('/', projectsController.getAllProjects);

module.exports = router;