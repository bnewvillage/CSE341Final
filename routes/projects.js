const router = require('express').Router({ mergeParams: true });
const projectsController = require('../controllers/projects');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', projectsController.getAllProjects);
router.get('/:projectId',projectsController.getOneProject);
router.post('/', isAuthenticated,projectsController.createProject);
router.put('/:projectId', isAuthenticated,projectsController.updateProject);
router.delete('/:projectId', isAuthenticated,projectsController.deleteProject);

const taskRoutes = require('./tasks');
router.use('/:projectId/tasks',isAuthenticated, taskRoutes);
module.exports = router;