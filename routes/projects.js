const router = require('express').Router();
const projectsController = require('../controllers/projects');

router.get('/', projectsController.getAllProjects);
router.get('/:projectId', projectsController.getOneProject);
router.post('/', projectsController.createProject);
router.put('/:projectId', projectsController.updateProject);
router.delete('/:projectId', projectsController.deleteProject);

const taskRoutes = require('./tasks');
router.use('/:projectId/tasks', taskRoutes);
module.exports = router;