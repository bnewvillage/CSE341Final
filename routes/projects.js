const router = require('express').Router();
const projectsController = require('../controllers/projects');

router.get('/', projectsController.getAllProjects);
router.get('/:id', projectsController.getOneProject);
router.post('/', projectsController.createProject);
router.put('/:id', projectsController.updateProject);
router.delete('/:id', projectsController.deleteProject);

module.exports = router;