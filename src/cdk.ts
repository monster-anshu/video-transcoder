import 'dotenv/config';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { ORIGINAL_VIDEO_BUCKET, TRANSCODED_VIDEO_BUCKET } from './env';

export class ApplicationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const originalVideoBucket = new s3.Bucket(this, 'OriginalVideoBucket', {
      bucketName: ORIGINAL_VIDEO_BUCKET,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: true,
    });

    const transcodedVideoBucket = new s3.Bucket(this, 'TranscodedVideoBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: TRANSCODED_VIDEO_BUCKET,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      autoDeleteObjects: true,
    });

    const publicPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.AnyPrincipal()],
      actions: ['s3:GetObject'],
      resources: [transcodedVideoBucket.arnForObjects('*')],
    });

    transcodedVideoBucket.addToResourcePolicy(publicPolicy);

    const queue = new sqs.Queue(this, 'VideoPutQueue', {
      visibilityTimeout: cdk.Duration.seconds(300),
      queueName: 'monster-anshu-video-put-queue',
    });

    originalVideoBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.SqsDestination(queue),
    );
  }
}

const app = new cdk.App();
new ApplicationStack(app, 'ApplicationStack');
app.synth();
