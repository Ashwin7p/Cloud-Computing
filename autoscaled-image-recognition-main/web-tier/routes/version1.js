const express = require('express')
const router = express.Router();
const uploader = require('./uploader');

router.use('/uploader',uploader);

module.exports = router

