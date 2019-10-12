'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(require('./routes'));

app.use((err, req, res, next) => {
    return res.send({
        status: "error",
        data: {},
        error: {
            status: 404,
            message: 'refer API doc!!!! cause there is no such route.'
        }
    });

});

app.listen(process.env.PORT || 3000, () => {
    console.log('Node.js listening ...');
});