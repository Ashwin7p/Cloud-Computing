from image_classification import Classifier
from SQSComs import SQSQueue
from S3Coms import S3FileManager
import time
import subprocess

# Initialize the SQS clients and S3 file manager
input_sqs_queue = SQSQueue("SQS-requests")
output_sqs_queue = SQSQueue("SQS-Responses")
s3_images = S3FileManager("cumulonimbus-clouds-images")
s3_results = S3FileManager("cumulonimbus-clouds-results")



classifier = Classifier()
retry_count=0

while True:
    try:     
        if input_sqs_queue.get_queue_length() > 0:
            # Receive messages from the input SQS queue
            messages = input_sqs_queue.receive_messages(max_messages=1)

            # Process the first message
            message = messages[0]
            s3_key = message['Body']
            print(f"found message with key {s3_key}", end=" -->")
            # Download the image from S3
            image_path = f"/tmp/{s3_key}"
            s3_images.copy_image_to_file(s3_key, image_path)

            # Perform image classification (you need to implement this function)
            classification_result =  classifier.get_classification(image_path)

            # Store the classification result in another S3 bucket
            result_s3_key = s3_key
            s3_results.upload_text(result_s3_key, classification_result)

            print(f"classification result {classification_result}")
            # Delete the message from the input SQS queue
            input_sqs_queue.delete_message(message['ReceiptHandle'])

            retry_count=0

            # Send a new message with the key and classification result to another SQS queue
            output_sqs_queue.send_message(f"{s3_key}#$@$#{classification_result}")
        else:
            time.sleep(5)
    except:
        print("[Warning] the SQS queue depth is not updated, expected behavior due to processing lags")
        # Sleep for a while before checking for new messages again
        time.sleep(10) 
        retry_count = 0  
        if retry_count > 4: 
            subprocess.run(['shell/terminate_app_tier.sh'], check=True, shell=True) 
        else: retry_count += 1

