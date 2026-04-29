const express = require('express');
const axios = require('axios');

require('dotenv').config();

const router = express.Router();
const apiKey = process.env.API_KEY;
const apiReadAccessToken = process.env.API_READ_ACCESS_TOKEN;

function buildTmdbRequestConfig(clientParams) {
    const config = { params: clientParams };

    if (apiReadAccessToken) {
        config.headers = {
            Authorization: `Bearer ${apiReadAccessToken}`
        };
    } else {
        config.params.api_key = apiKey;
    }

    return config;
}

// acts as middleware between front-end and the-movie-db api
router.get('/', async function (req, res) {
    try {
        const forwardedParams = req.query.params
            ? Object.fromEntries(new URLSearchParams(req.query.params))
            : {};

        const response = await axios.get(
            `https://api.themoviedb.org/3${req.query.endPoint}`,
            buildTmdbRequestConfig(forwardedParams)
        );

        res.send(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(502).send({ error: 'Unable to fetch data from The Movie Database API.' });
    }
});

module.exports = router;
