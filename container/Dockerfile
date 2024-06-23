FROM ubuntu:focal

ENV DEBIAN_FRONTEND=noninteractive 

RUN apt-get update \
    && apt-get install -y ffmpeg awscli

WORKDIR /home/app

# ENV AWS_ACCESS_KEY_ID=access_key \
#     AWS_SECRET_ACCESS_KEY=secret_key \
#     AWS_DEFAULT_REGION=us-east-1 \
#     ORIGINAL_VIDEO_BUCKET=bucket1 \
#     TRANSCODED_VIDEO_BUCKET=bucket2  \
#     SOURCE_KEY=video.mp4 

COPY run.sh run.sh
CMD [ "bash" , "run.sh"]