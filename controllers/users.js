const mongoDb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAdmins = async (req, res) => {
    //#swagger.tags = ['User']
    try {
        await mongoDb.getDatabase().db().collection('users').find({ role: 'admin' }).toArray()
            .then((admins, err) => {
                if (err) {
                    return res.status(500).json({ message: err || 'An error has occurred in collecting users from database' });
                }

                if (admins.length === 0) {
                    return res.status(404).json({ message: 'Could not find users.' });
                }

                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(admins);
            });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
};

const createUser = async (req, res) => {
    //#swagger.tags = ['User']
    try {
        const user = {
            googleId: req.body.googleId,
            displayName: req.body.displayName,
            name: {
              givenName: req.body.givenName,
              familyName: req.body.familyName
            },
            email: req.body.email,
            photo: req.body.photos,
            provider: profile.provider,
            role: 'user'
          };

        const result = await mongoDb.getDatabase().db().collection('users').insertOne(user);
        if (result.acknowledged) {
            res.status(201).json({ id: result.insertedId });
        } else {
            res.status(500).json({ message: 'Failed to create user.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
};

const updateUser = async (req, res) => {
    //#swagger.tags = ['User']
    try {
        const userId = new ObjectId(req.params.id);
        const user = req.body;
        const result = await mongoDb.getDatabase().db().collection('users').replaceOne({ _id: userId }, user);
        if (result.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'User not found or data is the same.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
};

const deleteUser = async (req, res) => {
    //#swagger.tags = ['User']
    try {
        const userId = new ObjectId(req.params.id);
        const result = await mongoDb.getDatabase().db().collection('users').deleteOne({ _id: userId });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'User deleted.' });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
};

module.exports = {
    getAdmins,
    createUser,
    updateUser,
    deleteUser
};
