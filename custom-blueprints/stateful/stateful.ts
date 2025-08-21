import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

import { Construct } from 'constructs';
import { Stage } from '../types';

export interface BlueprintsStatefulStackProps extends cdk.StackProps {
  shared: {
    stage: Stage;
  };
}

export class BlueprintsStatefulStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: BlueprintsStatefulStackProps,
  ) {
    super(scope, id, props);

    const {
      shared: { stage },
    } = props;

    // we have our own normal cdk s3 bucket which will get our default properties
    // through blueprints
    new s3.Bucket(this, 'S3Bucket', {
      bucketName: `example-custom-construct-buck-${stage}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
