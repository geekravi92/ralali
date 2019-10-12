'use strict'

const app = module.exports = require('express')();
app.use('/urls', require('./urls'));