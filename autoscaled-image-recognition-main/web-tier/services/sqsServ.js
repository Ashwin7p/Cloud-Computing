const axios = require('axios');
// const config = require("../config"); //store s3 and sqs creds and keys
require('dotenv').config()

const fs = require('fs');
const AWS = require('aws-sdk');
const BUCKET_NAME = 'cc-project-input-image';
AWS.config.update({region: 'us-east-1'});
const sqs = new AWS.SQS({
    accessKeyId: 'AKIAQ3RPE3LWQIQROFME', secretAccessKey: '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'
});

async function removeFromQueue(message) {
    console.log("Remove message from Queue")
    sqs.deleteMessage({
        QueueUrl : process.env.RESPONSE_SQS_URL,
        ReceiptHandle : message.ReceiptHandle
    }, function(err, data) {
        err && console.log(err);
    });
  };


async function _sendMessage(params){
    console.log("Sending message in sqs");
    params.DelaySeconds= 0;    
    params.QueueUrl= "https://sqs.us-east-1.amazonaws.com/059154684653/SQS-requests";

    sqs.sendMessage(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data.MessageId);
        }
      });
}

async function _pollMessages(clientIp,params,count){
    try {//making first request cold

        /*if(process.env.clientIp==undefined){
            process.env.clientIp="";
        }*/

        while (true) {
          // Poll for messages from the queue
          
          if(params.MaxNumberOfMessages=1){
            const data = await sqs.receiveMessage(params).promise();

          if(data.Messages && data.Messages.length==1){
            const messageBody =  message.Body.toString();
              if(messageBody!=undefined){
                console.log(`message received ${messageBody}`);
                //get client Ip
                let myArray = messageBody.split("$#@$#");
                let myArrayclientIp = myArray[0];
                console.log(`client ip in message body ${myArrayclientIp}`);
                if(process.env[myArrayclientIp]==undefined){
                    process.env[myArrayclientIp]="";
                }             
                // add the result to client results   
                process.env[myArrayclientIp]+=myArray[1]+",";
                const deleteParams = {
                    QueueUrl: process.env.RESPONSE_SQS_URL,
                    ReceiptHandle: message.ReceiptHandle,
                };
                await sqs.deleteMessage(deleteParams).promise();
                console.log(`updated message body`);
                console.log(process.env[myArrayclientIp]);
                break;
              }
            }
          console.log('All messages processed and deleted.');
          return;

          }
          else{
            const data = await sqs.receiveMessage(params).promise();
            if (data.Messages && data.Messages.length > 0) {
              // Process and delete each message
              for (const message of data.Messages) {
                // Process the message as needed (e.g., parse JSON)
                const messageBody =  message.Body.toString();
                if(messageBody!=undefined){
                  console.log(`message received ${messageBody}`);
                  //get client Ip
                  let myArray = messageBody.split("$#@$#");
                  let myArrayclientIp = myArray[0];
                  console.log(`client ip in message body ${myArrayclientIp}`);
                  if(process.env[myArrayclientIp]==undefined){
                      process.env[myArrayclientIp]="";
                  }             
                  // add the result to client results   
                  process.env[myArrayclientIp]+=myArray[1]+",";
                  const deleteParams = {
                      QueueUrl: process.env.RESPONSE_SQS_URL,
                      ReceiptHandle: message.ReceiptHandle,
                  };
                  await sqs.deleteMessage(deleteParams).promise();
                  console.log(`updated message body`);
                  console.log(process.env[myArrayclientIp]);
                }
              }
            } else {
              // No more messages in the queue, break out of the loop
              count++;
              if(count <=1){
                  console.log(`sleeping for 2s`)
                  await new Promise((resolve) => setTimeout(resolve, 2000));
                  _pollMessages(clientIp,params,count)
                  
              }else{
                  break;
              }
            }
          }

        

          /*if (data.Messages && data.Messages.length > 0) {
            // Process and delete each message
            for (const message of data.Messages) {
              // Process the message as needed (e.g., parse JSON)
              const messageBody =  message.Body.toString();
              if(messageBody!=undefined){
                console.log(`message received ${messageBody}`);
                //get client Ip
                let myArray = messageBody.split("$#@$#");
                let myArrayclientIp = myArray[0];
                console.log(`client ip in message body ${myArrayclientIp}`);
                if(process.env[myArrayclientIp]==undefined){
                    process.env[myArrayclientIp]="";
                }             
                // add the result to client results   
                process.env[myArrayclientIp]+=myArray[1]+",";
                const deleteParams = {
                    QueueUrl: process.env.RESPONSE_SQS_URL,
                    ReceiptHandle: message.ReceiptHandle,
                };
                await sqs.deleteMessage(deleteParams).promise();
                console.log(`updated message body`);
                console.log(process.env[myArrayclientIp]);
              }
            }
          } else {
            // No more messages in the queue, break out of the loop
            count++;
            if(count <=1){
                console.log(`sleeping for 2s`)
                await new Promise((resolve) => setTimeout(resolve, 2000));
                _pollMessages(clientIp,params,count)
                
            }else{
                break;
            }
          }
        }*/
    
        
      }
      } catch (error) {
        console.error('Error processing messages:', error);
      }

    /*else {
            setTimeout(function() {
                _pollMessages(clientIp,params);
            }, 10 * 1000);
          // dataDict = {}
        }
    });*/
}

module.exports = {
    sendMessage: async function(params){
        return await _sendMessage(params);
    },
    pollMessages: async function(clientIp,params){
        let count=0;
        return await _pollMessages(clientIp,params,count);
    }
}
