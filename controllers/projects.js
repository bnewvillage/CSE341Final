const mongoDb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllProjects = async (req, res) => {
    //#swagger.tags = ['Projects']
    try {
        await mongoDb.getDatabase().db().collection('projects').find().toArray()
        .then((projects, err) =>{
            if (projects.length === 0){
                return res.status(404).json({message: 'No data found'})
            }

            if (err) {
                return res.status(505).json({message: err});
            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(projects);
        });
    } catch (error) {
        res.status(500).json({message: error.message || 'Internal Server Error'})
    }
}

//get ONE project
const getOneProject = async (req, res, param) => {
    //#swagger.tags = ['Projects']
    const projectId = new ObjectId(req.params.id);
    try {
        await mongoDb.getDatabase().db().collection('projects').find({_id: projectId}).toArray()
        .then((projects, err) =>{
            if (projects.length === 0){
                return res.status(404).json({message: 'No data found'})
            }

            if (err) {
                return res.status(505).json({message: err});
            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(projects);
        });
    } catch (error) {
        res.status(500).json({message: error.message || 'Internal Server Error'})
    }
}

const createProject = async (req, res)=>{
    try {
        const project = {
            title: req.body.title,
            description: req.body.description,
            owner: req.user._id,
            members: req.body.members.map(id => new ObjectId(id)),
            createdAt: new Date()
            };
        const response = await mongoDb.getDatabase().db().collection('projects').insertOne(project);
            if (response.acknowledged){
                res.status(201).json({message: 'Project Created.', project: project});
            } else {
                res.status(500).json({message: 'Failed to create project.'});
            }
    }   catch (err) {
        res.status(500).json({message: err.message || 'Error occurred'});
    }
}

const updateProject = async (req, res) => {
    try {
        const projectId = new ObjectId(req.params.id);
        const updateData = {
            title: req.body.title,
            description: req.body.description,
            members: req.body.members ? req.body.members.map(id => new ObjectId(id)) : []
        };

        const response = await mongoDb.getDatabase().db().collection('projects').updateOne(
            { _id: projectId },
            { $set: updateData }
        );

        if (response.matchedCount === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ message: 'Project updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message || 'Error occurred while updating project' });
    }
};

const deleteProject = async (req, res) => {
    try {
        const projectId = new ObjectId(req.params.id);

        const response = await mongoDb.getDatabase().db().collection('projects').deleteOne({ _id: projectId });

        if (response.deletedCount === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message || 'Error occurred while deleting project' });
    }
};


module.exports = {
    getAllProjects,
    getOneProject,
    createProject,
    updateProject,
    deleteProject
};