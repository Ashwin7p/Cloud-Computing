const AWS = require('aws-sdk');
const fs = require('fs');

// Set your AWS credentials
AWS.config.update({
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1', // Specify your desired AWS region
  });

// Initialize AWS clients
const ec2 = new AWS.EC2({ region: 'us-east-1'});

const sqs = new AWS.SQS({ region: 'us-east-1' });

async function createInstance(imageId, maxInstances, cnt) {
  let minInstances = maxInstances - 1; // create 1 instance
  let maxInstanceNum = maxInstances;

  if (minInstances === 0) {
    minInstances = 1;
  }

  const securityGroupIds = ['launch-wizard-2'];

  const tagSpecifications = [
    {
      ResourceType: 'instance',
      Tags: [{ Key: 'Name', Value: `try-instance${cnt}` }],
    },
  ];

  

  const params = {
    ImageId: imageId,
    MinCount: minInstances,
    MaxCount: maxInstanceNum,
    InstanceType: 't2.micro',
    SecurityGroupIds: securityGroupIds,
    TagSpecifications: tagSpecifications,
    KeyName: '',
	IamInstanceProfile: {
    Name: '', // Replace with your IAM role name
  },
  };

  try {
    const result = await ec2.runInstances(params).promise();
    return cnt;
  } catch (error) {
    return cnt;
  }
}


async function terminateInstanceByName(instanceName) {
    try {
      // Step 1: List instances with the specified name
        const describeInstancesParams = {
            Filters: [
                {
                    Name: 'tag:Name',
                    Values: [instanceName],
                },
                {
                Name: 'instance-state-name',
                Values: ['running', 'pending'],
                },
            ],
        };
  
        const instances = await ec2.describeInstances(describeInstancesParams).promise();
  
        if (instances.Reservations.length === 0) {
            console.log(`No instances found with the name "${instanceName}"`);
            return;
        }
  
        const instanceId = instances.Reservations[0].Instances[0].InstanceId;
  
         // Step 2: Terminate the identified instance by its instance ID
       const terminateParams = {
            InstanceIds: [instanceId],
        };
  
        const terminationResult = await ec2.terminateInstances(terminateParams).promise();
  
        console.log(`Instance with name "${instanceName}" (ID: ${instanceId}) has been terminated.`);
    } 
    catch (error) {
        console.error('Error terminating instance:', error);
    }
}

async function getApproxtotalMsgs() {
  const queueUrl =
    '';
  const attrNames = ['ApproximateNumberOfMessages'];

  const params = {
    QueueUrl: queueUrl,
    AttributeNames: attrNames,
  };

  try {
    const result = await sqs.getQueueAttributes(params).promise();
    const totalMsgsStr = result.Attributes.ApproximateNumberOfMessages;
    const totalMsgs = parseInt(totalMsgsStr, 10);
    return totalMsgs;
  } catch (error) {
    console.error(error);
    return 0;
  }
}


async function getNumOfInstances() {
  const params = {
    IncludeAllInstances: true,
  };

  try {
    const result = await ec2.describeInstanceStatus(params).promise();
    const instanceStatusList = result.InstanceStatuses;
    let totalRunningInstances = 0;

    for (const instanceStatus of instanceStatusList) {
      const instanceState = instanceStatus.InstanceState;
      if (
        instanceState.Name === 'pending' ||
        instanceState.Name === 'running'
      ) {
        totalRunningInstances+=1;
      }
    }
    return totalRunningInstances;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

  async function scaleInScaleOut() {
    let cnt = 0;
    while (true) {
        const totalMsgs = await getApproxtotalMsgs();
        const totalRunningInstances = await getNumOfInstances();
        const totalAppInstances = totalRunningInstances - 1;

        console.log('messages in Input Queue: ' + totalMsgs);
        console.log('total app-instances: ' + totalAppInstances);

        let newInstancesRequired = 0;
        if (totalMsgs>1 && totalMsgs<=20) {
            newInstancesRequired = totalMsgs - 1;
        }
        else if(totalMsgs>10) {
            newInstancesRequired = 19;
        }
        else {
            newInstancesRequired = 0;
        }
        
        if (newInstancesRequired > totalAppInstances && totalAppInstances<=9) {
            if (totalMsgs > 1) {
                const newInstancesToCreate = newInstancesRequired - totalAppInstances;
                if (newInstancesToCreate > 0) {
                    let newInstanceCounter = totalAppInstances
                    for (let i = 0; i < newInstancesToCreate; i++) {
                        cnt = await createInstance('ami-0c77824d809cace33', 1, ++newInstanceCounter);
                    }
                    cnt++;
                }
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Sleep for 3 seconds
    }
}


// Call the main scaling function
scaleInScaleOut();
