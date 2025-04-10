const mongoDb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const Project = require('../models/project')

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
        const project = new Project({
          title: req.body.title,
          description: req.body.description,
          owner: req.user._id,
          members: req.body.members.map(id => mongoose.Types.ObjectId(id))
        });
    }   catch (err) {
        res.status(500).json({message: err.message || 'Error occurred'});
    }
}

module.exports = {
    getAllProjects,
    getOneProject,
    createProject
};