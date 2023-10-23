#!/bin/bash

# Switch to the 'ubuntu' user
sudo su ubuntu

cd /home/ubuntu/autoscaled-image-recognition/app-tier/
python3 driver.py >> logged_app_run.log
