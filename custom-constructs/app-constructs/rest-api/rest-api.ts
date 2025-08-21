import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as logs from 'aws-cdk-lib/aws-logs';

import { Construct } from 'constructs';

interface ApiProps
  extends Omit<
    apigw.RestApiProps,
    | 'cloudWatchRole'
    | 'retainDeployments'
    | 'restApiName'
    | 'disableExecuteApiEndpoint'
  > {
  /**
   * The stage name which the api is being used with
   */
  stageName: string;
}

type FixedApiProps = Pick<
  apigw.RestApiProps,
  | 'cloudWatchRole'
  | 'retainDeployments'
  | 'restApiName'
  | 'disableExecuteApiEndpoint'
  | 'deployOptions'
>;

export class RestApi extends Construct {
  public readonly api: apigw.RestApi;

  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id);

    // fixed properties that we want to enforce
    const fixedProps: FixedApiProps = {
      cloudWatchRole: true,
      retainDeployments: false,
      restApiName: `api-${props.stageName}`,
      disableExecuteApiEndpoint: true,
      deployOptions: {
        stageName: 'api',
        loggingLevel: apigw.MethodLoggingLevel.INFO,
        tracingEnabled: true,
        metricsEnabled: true,
        accessLogDestination: new apigw.LogGroupLogDestination(
          new logs.LogGroup(this, `${id}ApiLogs`, {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            retention: logs.RetentionDays.ONE_DAY,
            logGroupName: `/aws/apigateway/api-${props.stageName}`,
          }),
        ),
      },
    };

    this.api = new apigw.RestApi(this, `${id}Api`, {
      // custom props
      description: props.description
        ? props.description
        : `API ${props.stageName}`,
      deploy: props.deploy !== undefined ? props.deploy : true,
      disableExecuteApiEndpoint: false,
      // fixed props
      ...fixedProps,
    });
  }
}
