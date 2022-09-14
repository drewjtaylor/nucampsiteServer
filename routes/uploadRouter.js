const express = require('express');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
    
})

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can only upload image files.'), false)
    } else {
        cb(null, true)
    }
}

const upload = multer({
    storage, // If there's an error change this to storage: storage,
    fileFilter: imageFileFilter,
})

const uploadRouter = express.Router();

uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'Application/json')
    res.json(req.file)
})
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`${this.name} not supported on imageUpload`)
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`${this.name} not supported on imageUpload`)
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`${this.name} not supported on imageUpload`)
})


module.exports = uploadRouter