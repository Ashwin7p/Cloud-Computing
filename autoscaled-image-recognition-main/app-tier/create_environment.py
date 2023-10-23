import os
import random
import time


from SQSComs import SQSQueue
from S3Coms import S3FileManager

# Initialize the SQS queue and S3 file manager
sqs_queue = SQSQueue("SQS-requests")
s3_manager = S3FileManager("cumulonimbus-clouds-images")

# Define the local directory containing the images
image_directory = "/home/ubuntu/app-tier/data/imagenet-100-updated/imagenet-100/"

# List all files in the directory
image_files = os.listdir(image_directory)
image_files = [file for file in image_files]

# Shuffle the list of image files to randomize the order
random.shuffle(image_files)

# Process the first 10 image files
for i, image_file in enumerate(image_files[:10]):
    # Generate a unique filename prefix
    filename_prefix = f"IP__{i}"

    # Insert a message into the SQS queue with the filename prefix
    message_body = f"{filename_prefix}_{image_file}"
    sqs_queue.send_message(message_body)

    # Upload the image to S3 with the filename prefix
    s3_key = f"{filename_prefix}_{image_file}"
    s3_manager.upload_image(s3_key, os.path.join(image_directory, image_file))

    print(f"Processed image {i+1}: {image_file}")
