const express = require('express');

const campsiteRouter = express.Router();


// Routing method acts as a catch-all for any HTTP verb
// As with all routing methods, takes 2 parameters(path, function-to-do-when-called)
campsiteRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();  // passes control to the next routing method after this one. Otherwise it would stop here, and not go further
})
.get((req, res) => { //"next" not included because there are no more instructinos after this)
    res.end('Will send all campsites to you');
})
.post((req, res) => {
    const campsiteName = req.body.name; // This is how we get information out of the request. req.body.whatever-will-be-submitted
    const campsiteDescription = req.body.description;
    res.end(`Will update the campsites with the following:\nCampsite name: ${campsiteName}\nCampsite description: ${campsiteDescription}`)
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /campsites')
})
.delete((req, res) => {
    res.end('Deleting all campsites');
});

// Routes for specific campsite (referenced by campsiteId)
campsiteRouter.route('/:campsiteId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send information for campsite with ID: ${req.params.campsiteId} to you`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end('POST operation not supported on for specific campsite IDs')

})
.put((req, res) => {
    res.end(`Will update the campsite with ID: ${req.params.campsiteId} with the following information:\nCampsite name: ${req.body.name}\nCampsite description: ${req.body.description}`)
})
.delete((req, res) => {
    res.end(`Deleting campsite with ID: ${req.params.campsiteId}`);
});

module.exports = campsiteRouter;