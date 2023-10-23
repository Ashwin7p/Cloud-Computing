const express = require("express");
const router = express.Router();
const uploadImage = require("../controllers/uploadImageCon")
// const s3Con = require("../controllers/admin");
// const sqsCon = require("../controllers/cycle");


router.post("/upload-image", uploadImage.postImage);
router.get("/get-results",  uploadImage.getResults);

module.exports = router;
