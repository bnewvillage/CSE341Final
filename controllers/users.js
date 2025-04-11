const mongoDb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAdmins = async(req,res) =>{
    try {
        await mongoDb.getDatabase().db().collection('users').find({role: 'admin'}).toArray()
        .then((admins, err) =>{
            if (admins.length === 0){
                return res.status(404).json({message: 'Could not find users.'})
            }

            if (err) {
                return res.status(505).json({message: err || 'An error has occured in collecting users fromd database'})
            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(admins);
        });
    } catch (error) {
        res.status(500).json({message: error.message || 'Internal Server Error'})
    };
};

module.exports = {
    getAdmins
};