#!/bin/bash

OUTPUT_DIR=outputs
DOWLOAD_FILE=video

echo "Downloading file"
aws s3api get-object --bucket $ORIGINAL_VIDEO_BUCKET --key $SOURCE_KEY $DOWLOAD_FILE
echo "Download Complete"
mkdir $OUTPUT_DIR
echo "Transcoding start"
ffmpeg -i $DOWLOAD_FILE -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename $OUTPUT_DIR/segment%03d.ts -start_number 0 $OUTPUT_DIR/index.m3u8
echo "Transcoding Complete"
echo "Upload start"
aws s3 sync $OUTPUT_DIR s3://$TRANSCODED_VIDEO_BUCKET/$SOURCE_KEY
echo "Upload Complete"
