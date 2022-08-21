'use strict';

const express = require('express');
const router = express.Router();
const { authenticateUser } = require('./middleware/auth-user');
const { User, Course } = require('./models');
const bcrypt = require('bcryptjs');


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

// GET - /api/users
//  will return all properties and values for the currently authenticated User and 200 HTTP status code.
router.get('/users', authenticateUser, asyncHandler( async (req, res) => {
    const user = req.currentUser;

    // filter out unwanted properties
    const { password, createdAt, updatedAt, ...filteredUser } = user.toJSON();

    res.json( filteredUser );
}));


// POST - /api/users
//  will create a new user, set the Location header to "/", and 201 HTTP status code with no content.
router.post('/users', asyncHandler(async (req, res) => {
    try {
        const user = await User.build(req.body).validate();
        user.password = bcrypt.hashSync(user.password, 10);
        await user.save();
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

// GET - /api/courses
// will return all courses including the User associated with each course and 200 HTTP status code.
router.get('/courses', asyncHandler( async (req, res) => {
    try {
        const courses = await Course.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'emailAddress']
                }
            ]
        });

        // filter out unwanted properties
        const filteredCourses = courses
            .map( course => course.dataValues )
            .map( ({createdAt, updatedAt, ...filteredData}) => ({...filteredData}));

        res.status(200).json(filteredCourses);
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

// GET - /api/courses/:id
// will return the corresponding course including the User associated with that course and 200 HTTP status code.
router.get('/courses/:id', asyncHandler( async(req, res) => {
    try {
        const course = await Course.findByPk(req.params.id,
            {
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'firstName', 'lastName', 'emailAddress']
                    }
                ]
            }
        );

        // filter out unwanted properties
        const { createdAt, updatedAt, ...filteredCourse } = course.toJSON();

        res.status(200).json(filteredCourse);
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

// POST - /api/courses
// will create a new course, set the Location header to the URI for the newly created course
// will also  return a 201 HTTP status code and no content.
router.post('/courses/', authenticateUser, asyncHandler( async (req, res) => {
    const user = req.currentUser;

    try {
        const course =  await Course.create(req.body);
        res.location(`/api/courses/${course.id}`);
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

// PUT - /api/courses/:id
//will update the corresponding course and return 204 HTTP status code and no content
router.put('/courses/:id', authenticateUser, asyncHandler( async (req, res) => {
    const user = req.currentUser;
    
    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            if (user.id === course.userId) {
                await course.update(req.body);
                res.status(204).end();
            } else {
                res.status(403).json({message: "This user does not have access to this course"});
            }
        } else {
            res.status(404).json({message: "Course not found"});
        }
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


// DELETE - /api/courses/:id
// will delete the corresponding course and return 204 HTTP status code and no content.
router.delete('/courses/:id', authenticateUser, asyncHandler( async (req, res) => {
    const user = req.currentUser;

    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            if (user.id === course.userId) {
                await course.destroy();
                res.status(204).end();
            } else {
                res.status(403).json({message: "This user does not have access to this course"});
            }
        } else {
            res.status(404).json({message: "Course not found"});
        }
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

module.exports = router;