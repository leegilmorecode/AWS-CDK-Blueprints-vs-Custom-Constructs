import * as s3 from 'aws-cdk-lib/aws-s3';

import { Construct } from 'constructs';

// we allow all s3 bucket properties except for enforceSSL, versioned, and autoDeleteObjects
interface S3BucketProps
  extends Omit<
    s3.BucketProps,
    'enforceSSL' | 'autoDeleteObjects' | 'versioned'
  > {}

// fixed properties that we want to enforce
type FixedS3BucketProps = Pick<
  s3.BucketProps,
  'enforceSSL' | 'autoDeleteObjects' | 'versioned'
>;

export class S3Bucket extends Construct {
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: S3BucketProps) {
    super(scope, id);

    // in this example, we enforce SSL and auto-delete objects
    const fixedProps: FixedS3BucketProps = {
      enforceSSL: true,
      autoDeleteObjects: true,
      versioned: true,
    };

    this.bucket = new s3.Bucket(this, id, {
      // custom props
      ...props,
      // fixed props
      ...fixedProps,
    });
  }
}
