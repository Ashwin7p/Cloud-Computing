# App-tier

This folder is repsonsible to hold all the functionalities needed to host the app tier

## things left to do
1. [ ] Polling SQS queue and load topmost message from the queue(remember to [hide the message from the queue using a timeout](https://www.youtube.com/watch?t=623&v=CyYZ3adwboc&feature=youtu.be)  )
2. [ ] Pull image information from SQS message (Ideally the app would expect the image to be stored in an s3 bucket)
3. [ ] parse the SQS messsage, get the image location in s3
4. [ ] copy the image from S3 to local folder
5. [ ] Run the classifier
6. [ ] put the classification result in a new s3 bucket (along with the image) 
7. [ ] put the classification result in a SQS message and queue it(this queue is different than the first one)
8. [ ] remove the SQS message from the first queue using the reciept

### Steps 8 and 9 can be swapped in order




### Repetitive command that I use

```bash
mkdir ~/image_proc_folder
cp  app-tier/data/imagenet-100-updated/imagenet-100/* ~/image_proc_folder/

#clone repo
git clone https://github.com/hasagar97/autoscaled-image-recognition.git
pip3 install boto3
git switch app-tier
```

- running test on classifier class
`python3 driver.py`