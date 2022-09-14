const cors = require('cors');

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];

const corsOptionsDelegate = (req, cb) => {
    let corsOptions;
    console.log("req.header('Origin') is: " + req.header('Origin'));
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {origin: true}
    } else {
        corsOptions = {origin: false}
    };
    cb(null, corsOptions);
};

exports.cors = cors(); // For any origin

exports.corsWithOptions = cors(corsOptionsDelegate) // For whitelisted origins only