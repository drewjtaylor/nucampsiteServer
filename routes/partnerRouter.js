const express = require('express');
const Partner = require('../models/partner');
const authenticate = require('../authenticate');

const partnerRouter = express.Router();

// Routing method acts as a catch-all for any HTTP verb
// As with all routing methods, takes 2 parameters(path, function-to-do-when-called)
partnerRouter.route('/')
.get((req, res, next) => { //"next" not included because there are no more instructinos after this)
    Partner.find()
    .then(partners => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(partners)
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Partner.create(req.body)
    .then(partner => {
        console.log(`Partner created: ${partner}`);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner)
    })
    .catch(err => next(err))
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners')
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Partner.deleteMany() // Delete many passes information about what was deleted
    .then(partnersDeleted => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partnersDeleted);
    })
    .catch(err => next(err))
});

// Routes for specific partner (referenced by partnerId)
partnerRouter.route('/:partnerId')
.get((req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err))
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('POST operation not supported for specific partner IDs')
})
.put(authenticate.verifyUser, (req, res, next) => {
    Partner.findByIdAndUpdate(req.params.partnerId, {
        $set: req.body
    },
    {
        new: true
    })
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application.json');
        res.json(partner);
    })
    .catch(err => next(err))
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Partner.findByIdAndDelete(req.params.partnerId)
    .then(partnerDeleted => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application.json');
        res.json(partnerDeleted);
    })
    .catch(err => next(err))
});


module.exports = partnerRouter;