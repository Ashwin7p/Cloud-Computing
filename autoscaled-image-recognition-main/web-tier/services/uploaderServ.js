const axios = require('axios');
// const config = require("../config"); //store s3 and sqs creds and keys
const sqsServ = require("./sqsServ");
const s3Serv = require("./s3Serv");
const path = require("path");
const fs = require('fs');
require('dotenv').config()



/*
   * this function does the following -
   * 1. Checks if Cycle is Configured for the selected quarter and year.
   * 2. Checks if Goal is started for the Employee for the fetched cycle
*/

async function _postImage(clientIp, filename){
try{
    console.log("Uploading File ..");
    
    const fileContent = fs.readFileSync(path.resolve(__dirname, "../uploads/clients/requests/"+filename));
    let params = {
        Body: fileContent,
        Key: filename
    };

    console.log("Uploading to s3..");
    let res = await s3Serv.uploadImage(params);
    console.log("Uploading to sqs..");
    params = {
        MessageBody: filename
    };
    res = await sqsServ.sendMessage(params);
    return res;
}catch (error) {
    console.log(err);

}
}

async function _getImages(clientIp,count){
    try{
        console.log("Fetching Files ..");
        //poll sqs messages thats is

        const messageAttributes = {
            client_address: {
              DataType: 'String',
              StringValue: clientIp, // Replace with the value you want to filter on
            },
          };
          

        var params = {
            // AttributeNames: ["SentTimestamp"],
            MaxNumberOfMessages: count,
            // MessageAttributeNames: ["All"],
            QueueUrl: process.env.RESPONSE_SQS_URL,
            // MessageAttributeNames: ['client_address'], // Replace with the actual attribute name
            // MessageAttributeValues: messageAttributes,
            // VisibilityTimeout: 1,
            // WaitTimeSeconds: 0
            };
        await sqsServ.pollMessages(clientIp,params); //plaaning of split messages using ','
        console.log(`in _getImages ${process.env[clientIp]}`);
        console.log(`-----------other client------------`);
        let client2="::2";
        console.log(`in _getImages ${process.env[client2]}`);

        //add the respose to enve resultfiles
        return;
    }catch (error) {
        console.log(error);
    
    }
    }


module.exports = {
    postImage: async function(clientIp, filename){
        return await _postImage(clientIp, filename);
    },
    getImages: async function(clientIp){
        return await _getImages(clientIp);
    }
}


