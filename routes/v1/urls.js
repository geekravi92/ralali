const express = require('express');
const app = module.exports = require('express')();
const router = express.Router();

const {
    urls: {
        V1,
    }
} = require('./../../resources');

const v1 = new V1();

router.route('/').get((req, res, next) => {
    return res.status(200).json({
        status: true,
        msg: "Working",
    });
});
router.route('/shorten')
    .post(v1.requestSanity, v1.generateShortUrl);

app.use('/', router)
