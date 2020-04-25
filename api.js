var express = require('express')
var router = express.Router();
const request = require('request');
require('dotenv').config()

const apiKey = process.env.API_KEY;

// acts as middleware between front-end and the-movie-db api
router.get('/', function (req, res) {
    request('https://api.themoviedb.org/3' + req.query.endPoint + '?api_key=' + apiKey + req.query.params, { json: true }, (err, _, body) => {
        if (err)
            return console.log(err);

        res.send(body)
    });
})

module.exports = router;