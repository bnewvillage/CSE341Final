const mongoDb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getTask = async (req, res) => {
    //#swagger.tags = ['Task']
    try {
        const taskId = new ObjectId(req.params.taskId);
        await mongoDb.getDatabase().db().collection('tasks').find({ _id: taskId }).toArray()
            .then((task, error) => {
                if (task.length === 0) {
                    return res.status(404).json({ message: 'No data found' });
                }

                if (error) {
                    return res.status(505).json({ message: error });
                }
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(task);
            });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal Server Error.' });
    }
};

const createTask = async (req, res) => {
    //#swagger.tags = ['Task']
    try {
        const projectId = new ObjectId(req.params.projectId);
        const task = {
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
            assignedUser: req.body.assignedUser,
            project: projectId,
            createdAt: new Date()
        };
        const response = await mongoDb.getDatabase().db().collection('tasks').insertOne(task);
        const taskId = response.insertedId;
        
        //update project
        const project = await mongoDb.getDatabase().db().collection('projects').updateOne(
            { _id: projectId },
            { $push: {tasks: taskId }}
        );
        
        if (response.acknowledged) {
            res.status(201).json({ message: 'Task Created.', task: task, project: project});
            //update the project

        } else {
            res.status(500).json({ message: 'Failed to create task.' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message || 'Internal Server Error.' });
    }
};

const updateTask = async (req, res) => {
    //#swagger.tags = ['Task']
    try {
        const taskId = new ObjectId(req.params.taskId);
        const task = {
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
            assignedUser: req.body.assignedUser,
            project: new ObjectId(req.body.project),
            updatedAt: new Date()
        };
        const response = await mongoDb.getDatabase().db().collection('tasks').replaceOne({ _id: taskId }, task);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Task not found or unchanged.' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message || 'Internal Server Error.' });
    }
};

const deleteTask = async (req, res) => {
    //#swagger.tags = ['Task']
    try {
        const taskId = new ObjectId(req.params.taskId);
        const response = await mongoDb.getDatabase().db().collection('tasks').deleteOne({ _id: taskId });

        //update project
        await mongoDb.getDatabase().db().collection('projects').updateOne(
            { _id: projectId },
            { $pull: {tasks: taskId }}
        );

        
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'Task deleted.' });
        } else {
            res.status(404).json({ message: 'Task not found.' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message || 'Internal Server Error.' });
    }
};

module.exports = {
    getTask,
    createTask,
    updateTask,
    deleteTask
};
