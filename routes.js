const express = require('express');
const app = module.exports = express();

// cross origin request allowed to be removed on live
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Content-Type", "application/json");
    res.header("Server-Time-Stamp", new Date().getTime() / 1000);
    next();
});


require(__dirname + '/routes/').forEach(function (a) {
    app.use(a.prefix, a.app);
});