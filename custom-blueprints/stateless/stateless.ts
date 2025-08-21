import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

import { Construct } from 'constructs';
import { Stage } from '../types';

export interface BlueprintsStatelessStackProps extends cdk.StackProps {
  shared: {
    stage: Stage;
  };
}

export class BlueprintsStatelessStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: BlueprintsStatelessStackProps,
  ) {
    super(scope, id, props);

    const {
      shared: { stage },
    } = props;

    // we create a simple API Gateway REST API
    const api = new apigw.RestApi(this, 'RestApi', {
      description: `example api for stage ${stage}`,
    });

    // Add a /status resource with a GET method and inline Lambda integration as the most simple of examples
    const statusResource = api.root.addResource('status');
    statusResource.addMethod(
      'GET',
      new apigw.LambdaIntegration(
        new cdk.aws_lambda.Function(this, 'StatusFunction', {
          runtime: cdk.aws_lambda.Runtime.NODEJS_22_X,
          handler: 'index.handler',
          code: cdk.aws_lambda.Code.fromInline(`
                exports.handler = async () => ({
                  statusCode: 200,
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status: 'OK' }),
                });
              `),
        }),
        {
          proxy: true,
        },
      ),
    );
  }
}
