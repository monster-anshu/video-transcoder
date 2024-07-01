export interface S3EventBody {
  Records: Record[];
}

export interface Record {
  eventVersion: string;
  eventSource: string;
  awsRegion: string;
  eventTime: Date;
  eventName: string;
  userIdentity: ErIdentity;
  requestParameters: RequestParameters;
  responseElements: ResponseElements;
  s3: S3;
}

export interface RequestParameters {
  sourceIPAddress: string;
}

export interface ResponseElements {
  'x-amz-request-id': string;
  'x-amz-id-2': string;
}

export interface S3 {
  s3SchemaVersion: string;
  configurationId: string;
  bucket: Bucket;
  object: S3Object;
}

export interface Bucket {
  name: string;
  ownerIdentity: ErIdentity;
  arn: string;
}

export interface ErIdentity {
  principalId: string;
}

export interface S3Object {
  key: string;
  size: number;
  eTag: string;
  sequencer: string;
}
