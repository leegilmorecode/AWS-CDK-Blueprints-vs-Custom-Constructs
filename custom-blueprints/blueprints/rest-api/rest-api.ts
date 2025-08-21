import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as logs from 'aws-cdk-lib/aws-logs';

import { IPropertyInjector, InjectionContext } from 'aws-cdk-lib';

/**
 * Enforces security defaults for all RestApi constructs
 */
export class RestApiInjector implements IPropertyInjector {
  public readonly constructUniqueId: string;

  constructor() {
    // tell the CDK this injector applies to all RestApi constructs
    this.constructUniqueId = apigw.RestApi.PROPERTY_INJECTION_ID;
  }

  public inject(
    originalProps: apigw.RestApiProps,
    context: InjectionContext,
  ): apigw.RestApiProps {
    const enforcedProps: Partial<apigw.RestApiProps> = {
      cloudWatchRole: true,
      retainDeployments: false,
      disableExecuteApiEndpoint: true,
      deployOptions: {
        stageName: 'api',
        loggingLevel: apigw.MethodLoggingLevel.INFO,
        tracingEnabled: true,
        metricsEnabled: true,
      },
    };

    const overridden: string[] = [];

    // work out which props we're actually overriding
    if (originalProps.defaultCorsPreflightOptions) {
      overridden.push('defaultCorsPreflightOptions');
    }

    if (
      originalProps.cloudWatchRole !== undefined &&
      originalProps.cloudWatchRole !== enforcedProps.cloudWatchRole
    ) {
      overridden.push('cloudWatchRole');
    }

    if (
      originalProps.retainDeployments !== undefined &&
      originalProps.retainDeployments !== enforcedProps.retainDeployments
    ) {
      overridden.push('retainDeployments');
    }

    if (
      originalProps.disableExecuteApiEndpoint !== undefined &&
      originalProps.disableExecuteApiEndpoint !==
        enforcedProps.disableExecuteApiEndpoint
    ) {
      overridden.push('disableExecuteApiEndpoint');
    }

    if (originalProps.deployOptions) {
      const enforcedDeploy = enforcedProps.deployOptions!;
      const userDeploy = originalProps.deployOptions;

      if (
        (userDeploy.stageName &&
          userDeploy.stageName !== enforcedDeploy.stageName) ||
        (userDeploy.loggingLevel &&
          userDeploy.loggingLevel !== enforcedDeploy.loggingLevel) ||
        (userDeploy.tracingEnabled !== undefined &&
          userDeploy.tracingEnabled !== enforcedDeploy.tracingEnabled) ||
        (userDeploy.metricsEnabled !== undefined &&
          userDeploy.metricsEnabled !== enforcedDeploy.metricsEnabled)
      ) {
        overridden.push('deployOptions');
      }
    }

    if (overridden.length > 0) {
      console.warn(
        `⚠️ The following RestApi props were overridden to enforce best practices: ${overridden.join(
          ', ',
        )}`,
      );
    }

    // always enforce — build log group for access logs
    const accessLogDestination = new apigw.LogGroupLogDestination(
      new logs.LogGroup(context.scope, `${context.id}ApiLogs`, {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        retention: logs.RetentionDays.ONE_DAY,
      }),
    );

    return {
      ...originalProps,
      defaultCorsPreflightOptions:
        originalProps.defaultCorsPreflightOptions ?? {
          allowOrigins: apigw.Cors.ALL_ORIGINS,
          allowCredentials: true,
          allowMethods: ['OPTIONS', 'POST', 'GET', 'PUT', 'DELETE', 'PATCH'],
          allowHeaders: ['*'],
        },
      ...enforcedProps,
      deployOptions: {
        ...enforcedProps.deployOptions,
        accessLogDestination,
      },
    };
  }
}
