const express = require("express");
const uploadPdfController = require('../controller/uploadPdfController')
const router = express.Router();


router.post('/upload', uploadPdfController.uploadFile)


module.exports = router