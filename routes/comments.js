const router = require('express').Router({ mergeParams: true });
const commentsController = require('../controllers/comments');

router.get('/', commentsController.getCommentsForTask);
router.post('/', commentsController.createCommentForTask);
router.put('/:id', commentsController.updateComment);
router.delete('/:id', commentsController.deleteComment);

module.exports = router;
