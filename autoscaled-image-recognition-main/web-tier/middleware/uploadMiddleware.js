const multer = require('multer');
const fs = require('fs');
const path = require('path');
const requestIp = require('request-ip');

// Configure multer storage and file name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/clients/requests/');
  },
  filename: (req, file, cb) => {
    cb(null, requestIp.getClientIp(req)+"$#@$#"+file.originalname);
  }
});

// Create multer upload instance
const upload = multer({ storage: storage }).array('myfile', 1000);



module.exports = upload;