const express = require('express');

const partnerRouter = express.Router();


// Routing method acts as a catch-all for any HTTP verb
// As with all routing methods, takes 2 parameters(path, function-to-do-when-called)
partnerRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();  // passes control to the next routing method after this one. Otherwise it would stop here, and not go further
})
.get((req, res) => { //"next" not included because there are no more instructinos after this)
    res.end('Will send all partners to you');
})
.post((req, res) => {
    const partnerName = req.body.name; // This is how we get information out of the request. req.body.whatever-will-be-submitted
    const partnerDescription = req.body.description;
    res.end(`Will update the partners with the following:\npartner name: ${partnerName}\npartner description: ${partnerDescription}`)
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners')
})
.delete((req, res) => {
    res.end('Deleting all partners');
});

// Routes for specific partner (referenced by partnerId)
partnerRouter.route('/:partnerId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send information for partner with ID: ${req.params.partnerId} to you`);
})
.post((req, res) => {
    res.end('POST operation not supported on for specific partner IDs')

})
.put((req, res) => {
    res.end(`Will update the partner with ID: ${req.params.partnerId} with the following information:\npartner name: ${req.body.name}\npartner description: ${req.body.description}`)
})
.delete((req, res) => {
    res.end(`Deleting partner with ID: ${req.params.partnerId}`);
});

module.exports = partnerRouter;