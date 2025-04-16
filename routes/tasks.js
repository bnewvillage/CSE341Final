const router = require('express').Router({ mergeParams: true });
const tasksController = require('../controllers/tasks');

router.get('/:taskId', tasksController.getTask);
router.post('/', tasksController.createTask);
router.put('/:taskId', tasksController.updateTask);
router.delete('/:taskId', tasksController.deleteTask);

const commentsRoutes = require('./comments');
router.use('/:taskId/comments', commentsRoutes);
module.exports = router;
