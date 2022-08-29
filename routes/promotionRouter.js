const express = require('express');

const promotionRouter = express.Router();


// Routing method acts as a catch-all for any HTTP verb
// As with all routing methods, takes 2 parameters(path, function-to-do-when-called)
promotionRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();  // passes control to the next routing method after this one. Otherwise it would stop here, and not go further
})
.get((req, res) => { //"next" not included because there are no more instructinos after this)
    res.end('Will send all promotions to you');
})
.post((req, res) => {
    const promotionName = req.body.name; // This is how we get information out of the request. req.body.whatever-will-be-submitted
    const promotionDescription = req.body.description;
    res.end(`Will update the promotions with the following:\nPromotion name: ${promotionName}\nPromotion description: ${promotionDescription}`)
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions')
})
.delete((req, res) => {
    res.end('Deleting all promotions');
});

// Routes for specific promotion (referenced by promotionId)
promotionRouter.route('/:promotionId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send information for promotion with ID: ${req.params.promotionId} to you`);
})
.post((req, res) => {
    res.end('POST operation not supported on for specific promotion IDs')

})
.put((req, res) => {
    res.end(`Will update the promotion with ID: ${req.params.promotionId} with the following information:\nPromotion name: ${req.body.name}\nPromotion description: ${req.body.description}`)
})
.delete((req, res) => {
    res.end(`Deleting promotion with ID: ${req.params.promotionId}`);
});

module.exports = promotionRouter;