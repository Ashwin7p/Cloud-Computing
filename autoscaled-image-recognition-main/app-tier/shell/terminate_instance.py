import boto3
import requests

# Set the AWS region
region = 'us-east-1'

# Initialize the EC2 client
ec2 = boto3.client('ec2', region_name=region)

# Fetch the instance ID using EC2 metadata
try:
    response = requests.get('http://169.254.169.254/latest/meta-data/instance-id')
    response.raise_for_status()
    instance_id = response.text
    print(f"Instance ID: {instance_id}")

    # Terminate the instance
    response = ec2.terminate_instances(InstanceIds=[instance_id])
    print("Instance termination request submitted successfully.")
except requests.exceptions.RequestException as e:
    print(f"Error fetching instance ID: {e}")
except Exception as e:
    print(f"Error terminating instance: {e}")