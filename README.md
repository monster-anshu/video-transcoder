# Video Transcoder with S3 and FFmpeg

The primary task of this application is to convert large videos into smaller segments. This allows clients to load only the necessary parts of the video, saving bandwidth for users.

## Stack

### AWS S3

- **Purpose**: To store original and transcoded videos.
- **Capabilities**: Scales automatically and supports event notifications on uploads and changes in the bucket.

### Docker

- **Purpose**: To process videos.
- **Functionality**: Runs containers that handle the video processing and upload the results to the TranscodedVideoBucket.

### AWS SQS

- **Purpose**: To handle events triggered by video uploads.
- **Functionality**: Receives notifications when a video is uploaded to the OriginalVideoBucket.

### Node.js

- **Purpose**: To manage backend processes.
- **Functionality**: Handles the execution of containers and listens for events in the SQS queue.

### CDK (Cloud Development Kit)

- **Purpose**: To define the AWS infrastructure as code.
- **Functionality**: Creates the AWS application stack using CloudFormation templates.

## Process

1. **Video Upload**: A video file is uploaded to the `S3 OriginalVideoBucket`.
2. **SQS Notification**: An event is triggered and a message is pushed to a FIFO SQS queue.
3. **Node.js Server**: The server listens for new events in the SQS queue.
4. **Docker Container**: Upon receiving an event, the server spins up a Docker container using the `hgunwant2312/video-transcoder` image.
5. **Video Transcoding**: The container uses FFmpeg to transcode the video into smaller segments.
6. **Upload Segments**: The transcoded segments are uploaded to the `S3 TranscodedVideoBucket`.

This process ensures efficient video processing and bandwidth optimization for clients.
