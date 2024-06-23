import { SQSClient } from '@aws-sdk/client-sqs';
import { Consumer } from 'sqs-consumer';
import { S3EventBody } from './type';
import { docker } from './docker';
import {
  AWS_ACCESS_KEY_ID,
  AWS_DEFAULT_REGION,
  AWS_SECRET_ACCESS_KEY,
  SQS_URL,
  TRANSCODED_VIDEO_BUCKET,
} from 'src/env';

const sqsClient = new SQSClient({
  region: AWS_DEFAULT_REGION,
});

const sqsConsumer = Consumer.create({
  queueUrl: SQS_URL as string,
  handleMessage: async (message) => {
    const json = (JSON.parse(message.Body || '') as S3EventBody).Records.at(0);
    if (!json?.eventName.includes('ObjectCreated')) {
      return;
    }
    const container = await docker.createContainer({
      Image: 'hgunwant2312/video-transcoder',
      Env: [
        `AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}`,
        `AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}`,
        `AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}`,
        `TRANSCODED_VIDEO_BUCKET=${TRANSCODED_VIDEO_BUCKET}`,
        `ORIGINAL_VIDEO_BUCKET=${json.s3.bucket.name}`,
        `SOURCE_KEY=${json.s3.object.key}`,
      ],
    });
    console.log('Conatainer created');
    await container.start();
    console.log('Conatainer started');
  },
  sqs: sqsClient,
});

sqsConsumer.start();
process.setMaxListeners(0);
