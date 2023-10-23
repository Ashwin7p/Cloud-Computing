const axios = require('axios');
// const config = require("../config"); //store s3 and sqs creds and keys
const fs = require('fs');
const AWS = require('aws-sdk');
const BUCKET_NAME = 'cc-project-input-image';
AWS.config.update({region: 'us-east-1'});

const s3 = new AWS.S3({
    accessKeyId: 'AKIAQ3RPE3LWQIQROFME', secretAccessKey: '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'
});

// cumulonimbus-clouds-images     Bucket Name

// cumulonimbus-clouds-results     


async function _uploadImage(params){
    
    params.Bucket = "cumulonimbus-clouds-images";
    

    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        // console.log(`File uploaded successfully. ${data.Location}`);
        // console.log(data)

        //sendMessage(data.Location)
        // fs.unlinkSync('uploads/'+fileName);
      });  
}

module.exports = {
    uploadImage: async function(params){
        return await _uploadImage(params);
    }
}



