const express = require('express');
const authenticate = require('../authenticate');
const favorite = require('../models/favorite');
const Favorite = require('../models/favorite');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, async (req, res, next) => {
    try {
        const favorite = await Favorite.find({ user: req.user._id })
                               .populate('user')
                               .populate('campsites');
        if (favorite) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, favorite: favorite})
        }
    } catch (err) {
        next(err)
    };
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then(favoriteList => {
        if (favoriteList) {
            req.body.forEach(favoriteCampsite => {
                if (!favoriteList.campsites.includes(favoriteCampsite._id)) {
                    favoriteList.campsites.push(favoriteCampsite._id)
                }
            });
            favoriteList.save()
            .then(favorite => {
                res.status(200).setHeader('Content-Type', 'application/json').json(favorite)
            })
            .catch(err => next(err))
        } else { // else create a new favorite document
            Favorite.create({ user: req.user._id })
            .then(favoriteList => {
                if (favoriteList) {
                    req.body.forEach(favoriteCampsite => {
                        if (!favoriteList.campsites.includes(favoriteCampsite._id)) {
                            favoriteList.campsites.push(favoriteCampsite._id)
                        }
                    });
                    favoriteList.save()
                    .then(favorite => {
                        res.status(200).setHeader('Content-Type', 'application/json').json(favorite)
                    })
                    .catch(err => next(err))
                }
            })
            .catch(err => next(err))
        }
    })
    .catch(err => next(err))
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id})
    .then(favoriteList => {
        if (favoriteList) {
            res.status(200).setHeader('Content-Type', 'application/json').json(favoriteList)
        } else {
            res.setHeader('Content-Type', 'text/plain').end('You do not have any favorites to delete.')
        }
    })
    .catch(err => {next(err)})
})

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.fineOne({user: req.user._id})
    .then(favoriteList => {
        if (favorite) {
            if (!favoriteList.campsites.includes(req.params.campsiteId)) {
            favoriteList.campsites.push(campsite);
            favoriteList.save()
            .then(favorite => {
                res.status(200).setHeader('Content-Type', 'application/json').json(favorite)
            })
            .catch(err => next(err))
        } else {
            res.status(200).setHeader('Content-Type', 'text/plain').end('Campsite already a favorite.')
        };
        } else { // If the favorite-doc doesn't exist for this user
            Favorite.create( {user: req.user._id, campsites: [req.params.campsiteId]} )
            .then(favoriteList => {
                res.status(200).setHeader('Content-Type', 'application/json').json(favorite)
            })
            .catch(err => next(err))
        }
    })
    .catch(err => next(err))
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne( {user: req.user._id} )
    .then(favoriteList => {

        if (favoriteList) { 
            // Find the index of the campsite to be removed
            const campsiteIndex = favoriteList.campsites.indexOf(req.params.campsiteId);
             
            // Method 1
            // Remove the element from the favorite document array using splice()
            if (campsiteIndex >=0) { // Only if the campsite existedi in the first place...
                favoriteList.campsites.splice(index, 1);
            }

            // Method 2
            // favoriteList.campsites = favoriteList.campsites.filter(fav => fav !== req.params.campsiteId)
            favoriteList.save()
            .then(favorite => {
                res.status(200).setHeader('Content-Type', 'application/json').json(favorite)
            })



        } else { // If the favoriteList document wasn't found
            res.status(200).setHeader('Content-Type', 'text/plain').end('No favorites to delete')
        }
    })
    .catch(err => next(err))
})


module.exports = favoriteRouter;