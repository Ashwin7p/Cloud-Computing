import boto3

class S3FileManager:
    def __init__(self, bucket_name):
        self.bucket_name = bucket_name
        self.s3 = boto3.client('s3')

    def upload_image(self, key, image_file):
        """
        Upload an image file to S3.

        Args:
            key (str): The object key (S3 filename).
            image_file (str): The local path to the image file.
        """
        self.s3.upload_file(image_file, self.bucket_name, key)

    def upload_text(self, key, text):
        """
        Upload text content to S3.

        Args:
            key (str): The object key (S3 filename).
            text (str): The text content to upload.
        """
        self.s3.put_object(Bucket=self.bucket_name, Key=key, Body=text)

    def copy_image_to_file(self, key, file_path):
        """
        Copy an image from S3 to a local file.

        Args:
            key (str): The object key (S3 filename).
            file_path (str): The local path where the image should be copied.
        """
        self.s3.download_file(self.bucket_name, key, file_path)

# Example usage:
if __name__ == "__main__":
    bucket_name = "your-bucket-name"
    s3_manager = S3FileManager(bucket_name)
    
    # Upload an image to S3
    s3_manager.upload_image("image.jpg", "local_image.jpg")

    # Upload text content to S3
    s3_manager.upload_text("text.txt", "This is a text file.")

    # Copy an image from S3 to a local file
    s3_manager.copy_image_to_file("image.jpg", "downloaded_image.jpg")
