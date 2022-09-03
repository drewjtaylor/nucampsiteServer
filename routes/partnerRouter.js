const express = require('express');
const { handle } = require('express/lib/router');

const partnerRouter = express.Router();
const Partner = require('../models/partner');

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
.post((req, res, next) => {

    Partner.create(req.body)
    .then(partner => {
        console.log(`Partner created: ${partner}`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner)
    })
    .catch(err => next(err))
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners')
})
.delete((req, res, next) => {
    Partner.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
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
.post((req, res) => {
    res.statusCode = 403;
    res.end('POST operation not supported on for specific partner IDs')
})
.put((req, res, next) => {
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
.delete((req, res, next) => {
    Partner.findByIdAndDelete(req.params.partnerId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application.json');
        res.json(response);
    })
    .catch(err => next(err))
});

// Endpoints for partners/:partnerId/comments
partnerRouter.route('/:partnerId/comments')
.get((req, res, next) => { //"next" not included because there are no more instructinos after this)
    Partner.findById(req.params.partnerId)
    .then(partner => {
        if (partner) {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(partner.comments)
        } else {
            err = new Error(`Partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err)
        }
    })
    .catch(err => next(err));
})

.post((req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then(partner => {
        if (partner) {
            partner.comments.push(req.body);
            partner.save()
            .then((partner) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(partner.comments);
        })
        .catch(err => next(err));
        } else {
            err = new Error(`Partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err)
        }
    })
    .catch(err => next(err))
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /partners/${req.params.partnerId}/comments`);
})

.delete((req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then((partner) => {
        if (partner) {
            for (let i = partner.comments.length-1; i >=0; i-- ) {
                partner.comments.id(partner.comments[i]._id).remove();
            };
            partner.save()
            .then(partner => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(partner)
            })
            .catch(err => next(err))
        } else {
            err = new Error(`Partner ${req.params.partnerId} not found`);
            err.status=404
            return next(err)
        }
    })
    .catch(err => next(err))
});

// Endpoints for partners/:partnerId/comments/:commentId
partnerRouter.route('/:partnerId/comments/:commentId')
.get((req, res, next) => { //"next" not included because there are no more instructinos after this)
    Partner.findById(req.params.partnerId)
    .then(partner => {
        if (partner && partner.comments.id(req.params.commentId)) {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(partner.comments.id(req.params.commentId))
        } else if (!partner) {
            err = new Error(`Partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err)
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err)
        }
    })
    .catch(err => next(err));
})

.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /partners/${req.params.partnerId}/comments/${req.params.commentId}`)
})

.put((req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then(partner => {
        if (partner && partner.comments.id(req.params.commentId)) {
            if (req.body.rating) {
                partner.comments.id(req.params.commentId).rating = req.body.rating
            };
            if (req.body.text) {
                partner.comments.id(req.params.commentId).text = req.body.text
            };
            partner.save()
            .then(partner => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(partner)
            })
            .catch(err => next(err))
        } else if (!partner) {
            err = new Error(`Partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err)
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err)
        }
    })
})

.delete((req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then((partner) => {
        if (partner && partner.comments.id(req.params.commentId)) {
            partner.comments.id(req.params.commentId).remove();
            partner.save()
            .then(partner => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(partner)
            })
            .catch(err => next(err))
        } else if (!partner) {
            err = new Error(`Partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err)
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err)
        }
    })
    .catch(err => next(err))
});



module.exports = partnerRouter;