const express = require('express');
const authenticate = require('../authenticate');
const cors = require('./cors');

const promotionRouter = express.Router();

const Promotion = require('../models/promotion');

promotionRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Promotion.find()
    .then(promotions => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(promotions)
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

    Promotion.create(req.body)
    .then(promotion => {
        console.log(`Promotion created: ${promotion}`);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion)
    })
    .catch(err => next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('POST operation not supported for specific promotion IDs')
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.findByIdAndDelete(req.params.promotionId)
    .then(promotionDeleted => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application.json');
        res.json(promotionDeleted);
    })
    .catch(err => next(err))
});

module.exports = promotionRouter;