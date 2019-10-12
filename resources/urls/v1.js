'use strict'

const { promisify } = require('util');
const validUrl = require('valid-url');
const Randomatic = require('randomatic');
const redis = require('redis');
const redisClient = redis.createClient();
const hget = promisify(redisClient.hget);
const hset = promisify(redisClient.hset);
const regex = new RegExp(/^[0-9a-zA-Z_]{6}$/);
const {
    redis: {
        urls: {
            urlKey,
        }
    }
} = require('./../../config');

class V1 {
    async requestSanity(req, res, next) {
        const {
            url,
            shortcode,
        } = req.body;

        if (!validUrl.isUri(url)) {
            return res.status(400).json({
                status: false,
                msg: "url is not valid",
            });
        }

        if (!regex.test(shortcode)) {
            return res.status(422).json({
                status: false,
                mas: "Invalid Short Code",
            })
        }

        next();
    }

    async generateShortUrl(req, res, next) {
        const {
            url,
            shortcode,
        } = req.body;        

        let _shortcode = "";
        if (shortcode) {
            _shortcode = await hget(urlKey, shortcode);
            if (_shortcode) {
                return res.status(409).json({
                    status: false,
                    msg: "The the desired shortcode is already in use",
                });
            }
            _shortcode = "";
        }

        const result = {};

        // If the shorcode is already present
        let _url = await hget(urlKey, url);
        if (_url) {
            result.shortcode = _url;
        }

        //generate a short code
        _shortcode = new Randomatic(/^[0-9a-zA-Z_]{6}$/, 6);
        result.shortcode = _shortcode;
        await hset(urlKey, _shortcode, url);
        await hset(urlKey, url, _shortcode);

        return res.status(201).json(result);
    }
}

module.exports = V1;