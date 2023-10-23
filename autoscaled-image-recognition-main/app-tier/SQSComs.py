import boto3

class SQSQueue:
    def __init__(self, queue_name):
        self.queue_name = queue_name
        self.sqs = boto3.client('sqs', region_name='us-east-1')
        self.queue_url = self.get_queue_url()

    def get_queue_url(self):
        response = self.sqs.get_queue_url(QueueName=self.queue_name)
        return response['QueueUrl']

    def send_message(self, message_body):
        response = self.sqs.send_message(
            QueueUrl=self.queue_url,
            MessageBody=message_body
        )
        return response['MessageId']

    def receive_messages(self, max_messages=1):
        response = self.sqs.receive_message(
            QueueUrl=self.queue_url,
            MaxNumberOfMessages=max_messages
        )
        messages = response.get('Messages', [])
        return messages

    def delete_message(self, receipt_handle):
        self.sqs.delete_message(
            QueueUrl=self.queue_url,
            ReceiptHandle=receipt_handle
        )

    def get_queue_length(self):
        response = self.sqs.get_queue_attributes(
            QueueUrl=self.queue_url,
            AttributeNames=['ApproximateNumberOfMessages']
        )
        num_messages = int(response['Attributes']['ApproximateNumberOfMessages'])
        return num_messages

# Example usage:
if __name__ == "__main__":
    queue_name = "your-queue-name"
    sqs_queue = SQSQueue(queue_name)
    
    # Send a message to the queue
    message_id = sqs_queue.send_message("Hello, SQS!")

    # Receive messages from the queue
    messages = sqs_queue.receive_messages(max_messages=5)
    for message in messages:
        print(f"Received message: {message['Body']}")
        sqs_queue.delete_message(message['ReceiptHandle'])

    # Get the length of the queue
    queue_length = sqs_queue.get_queue_length()
    print(f"Queue length: {queue_length}")
