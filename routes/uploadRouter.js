const express = require('express');
const authenticate = require('../authenticate');
const multer = require('multer');

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
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'Application/json')
    res.json(req.file)
})
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`${this.name} not supported on imageUpload`)
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`${this.name} not supported on imageUpload`)
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`${this.name} not supported on imageUpload`)
})


module.exports = uploadRouter