'use strict';

const express = require('express');
const router = express.Router();
const { authenticateUser } = require('./middleware/auth-user');
const { User, Course } = require('./models');


function asyncHandler(cb){
    return async (req,res, next) => {
        try {
            await cb(req, res, next);
        } catch(err) {
            next(err);
        }
    }
}


// ROUTES - Users

// GET - /users
//  will return all properties and values for the currently authenticated User and 200 HTTP status code.
router.get('/users', authenticateUser, asyncHandler( async (req, res) => {
    const user = req.currentUser;

    res.json({ user });
}));


// POST - /users
//  will create a new user, set the Location header to "/", and 201 HTTP status code with no content.
router.post('/users', asyncHandler(async (req, res) => {
    try {
        await User.create(req.body);
        res.location('/');
        res.status(201).end();
    } catch (error) {
        console.log('ERROR: ', error.name);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
        } else {
            throw error;
        }
    }
}));



// ROUTES - Courses

module.exports = router;