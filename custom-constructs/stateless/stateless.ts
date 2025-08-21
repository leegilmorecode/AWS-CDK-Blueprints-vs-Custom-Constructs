import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

import { Construct } from 'constructs';
import { RestApi } from '../app-constructs';
import { Stage } from '../types';

export interface CustomConstructsStatelessStackProps extends cdk.StackProps {
  shared: {
    stage: Stage;
  };
}

export class CustomConstructsStatelessStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: CustomConstructsStatelessStackProps,
  ) {
    super(scope, id, props);

    const {
      shared: { stage },
    } = props;

    // we create our rest api using our custom construct
    const api = new RestApi(this, 'RestApi', {
      stageName: stage,
      description: `example api for stage ${stage}`,
      // restApiName: `example-api-${stage}`, <-- we can't set this here, it's enforced in the construct
      // retainDeployments: true, <-- we can't set this here, it's enforced in the construct
      // cloudWatchRole: true, <-- we can't set this here, it's enforced in the construct
      // disableExecuteApiEndpoint: true, <-- we can't set this here, it's enforced
    }).api;

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
