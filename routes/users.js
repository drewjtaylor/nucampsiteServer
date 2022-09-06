const express = require('express');
const router = express.Router();
const User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/signup', (req, res, next) => {
    User.findOne({username: req.body.username})  // Check if a user document exists with matching username
    .then(user => {
        if (user) {     // If there IS...
            const err = new Error(`User ${req.body.username} already exists!`);  // Get error ready
            err.status = 403; // Set status code
            return next(err) // Pass it on
        } else {    // If a user with that username did NOT already exist
            User.create({ // Create the user
                username: req.body.username, 
                password: req.body.password
            })
            .then(user => { // Let client know it was successful
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({status: 'Registration Successful!', user: user});
            })
            .catch(err => next(err))
        }
    })
    .catch(err => next(err))
})


router.post('/login', (req, res, next) => {
    if (!req.session.user) {  // If the current session has no user information
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            const err = new Error('You are not authenticated');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err)
        }
    
        // If there is an authHeader, deconstruct/decode the user and password and check it
        const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const [username, password] = auth;

        // Check if user exists for what was passed in
        User.findOne({username: username})
        .then(user => {
            if (!user) {
                const err = new Error('That username does not exist');
                err.status = 401;
                return next(err);
            } else if (user.password !== password) {
                const err = new Error('That password is incorrect');
                err.status = 401;
                return next(err);
            } else if (user.username === username && user.password === password) {
                req.session.user = 'authenticated';
                res.statusCode=200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('You are authenticated!')
            }
        })
        .catch(err => next(err))

    } else {  // If there IS a session for this client
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are already authenticated')
    }
})

router.get('/logout', (req, res, next) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    } else {
        const err = new Error('You are not logged in!');
        err.status = 401;
        return next(err);
    }
})

module.exports = router;
