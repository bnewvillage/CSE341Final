const mongoDb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getCommentsForTask = async (req, res) => {
    //#swagger.tags = ['Comment']
    try {
        const taskId = new ObjectId(req.params.taskId);
        const comments = await mongoDb.getDatabase().db().collection('comments').find({ taskId }).toArray();

        if (!comments.length) {
            return res.status(404).json({ message: 'No comments found for this task' });
        }

        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message || 'Internal Server Error.' });
    }
};


const createCommentForTask = async (req, res) => {
    //#swagger.tags = ['Comment']
    try {
        const taskId = new ObjectId(req.params.taskId);
        const comment = {
            content: req.body.content,
            authorId: new ObjectId(req.body.authorId),
            taskId: taskId,
            timestamp: new Date()
        };

        const result = await mongoDb.getDatabase().db().collection('comments').insertOne(comment);
        const commentId = new ObjectId(result.insertedId);

        if (result.acknowledged) {
            res.status(201).json({ message: 'Comment created', comment });
            //update task
            await mongoDb.getDatabase().db().collection('tasks').updateOne(
                { _id: taskId },
                { $push: {comments: commentId }}
            );
                        
            
        } else {
            res.status(500).json({ message: 'Failed to create comment' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message || 'Internal Server Error.' });
    }
};

const updateComment = async (req, res) => {
    //#swagger.tags = ['Comment']
    try {
        const taskId = new ObjectId(req.params.taskId)
        const commentId = new ObjectId(req.params.id);
        const updatedData = {
            content: req.body.content,
            authorId: new ObjectId(req.body.authorId),
            taskId: taskId,
            timestamp: new Date()
        };

        const result = await mongoDb.getDatabase().db().collection('comments').updateOne(
            { _id: commentId, taskId: taskId },
            { $set: updatedData }
          );
          
        if (result.modifiedCount > 0) {
            res.status(204).json(updatedData);
        } else {
            res.status(404).json({ message: 'Comment not found or unchanged' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message || 'Internal Server Error.' });
    }
};

const deleteComment = async (req, res) => {
    //#swagger.tags = ['Comment']
    try {
        const taskId = new ObjectId(req.params.taskId);
        const commentId = new ObjectId(req.params.id);
        const result = await mongoDb.getDatabase().db().collection('comments').deleteOne({
            _id: commentId,
            taskId: taskId
          });
          //update task
          await mongoDb.getDatabase().db().collection('tasks').updateOne(
            { _id: taskId },
            { $pull: {comments: commentId }}
        );
          
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Comment deleted' });
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message || 'Internal Server Error.' });
    }
};

module.exports = {
    createCommentForTask,
    getCommentsForTask,
    updateComment,
    deleteComment
};
