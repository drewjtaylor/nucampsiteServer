const express = require('express');
const authenticate = require('../authenticate');

const promotionRouter = express.Router();

const Promotion = require('../models/promotion');

// Routing method acts as a catch-all for any HTTP verb
// As with all routing methods, takes 2 parameters(path, function-to-do-when-called)
promotionRouter.route('/')
.get((req, res, next) => { //"next" not included because there are no more instructinos after this)
    Promotion.find()
    .then(promotions => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(promotions)
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {

    Promotion.create(req.body)
    .then(promotion => {
        console.log(`Promotion created: ${promotion}`);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion)
    })
    .catch(err => next(err))
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions')
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Promotion.deleteMany()
    .then(promotionsDeleted => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotionsDeleted);
    })
    .catch(err => next(err))
});

// Routes for specific promotion (referenced by promotionId)
promotionRouter.route('/:promotionId')
.get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err))
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('POST operation not supported for specific promotion IDs')
})
.put(authenticate.verifyUser, (req, res, next) => {
    Promotion.findByIdAndUpdate(req.params.promotionId, {
        $set: req.body
    },
    {
        new: true
    })
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application.json');
        res.json(promotion);
    })
    .catch(err => next(err))
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Promotion.findByIdAndDelete(req.params.promotionId)
    .then(promotionDeleted => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application.json');
        res.json(promotionDeleted);
    })
    .catch(err => next(err))
});

module.exports = promotionRouter;