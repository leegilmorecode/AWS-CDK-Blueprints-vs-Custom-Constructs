import * as cdk from 'aws-cdk-lib';

import { Construct } from 'constructs';
import { S3Bucket } from '../app-constructs';
import { Stage } from '../types';

export interface CustomConstructsStatefulStackProps extends cdk.StackProps {
  shared: {
    stage: Stage;
  };
}

export class CustomConstructsStatefulStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: CustomConstructsStatefulStackProps,
  ) {
    super(scope, id, props);

    const {
      shared: { stage },
    } = props;

    // lets create a very basic S3 bucket using our custom construct
    new S3Bucket(this, 'S3Bucket', {
      bucketName: `example-custom-construct-buck-${stage}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      // versioned: true, // <-- we can't set this here, it's enforced in the construct
      // autoDeleteObjects: true, <-- we can't set this here, it's enforced in the construct
      // enforceSSL: true, <-- we can't set this here, it's enforced in the construct
    });
  }
}
