#!/usr/bin/env node

import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';

import { RestApiInjector, S3BucketInjector } from '../blueprints';

import { Stage } from 'types';
import { getEnvironmentConfig } from '../app-config';
import { BlueprintsStatefulStack } from '../stateful/stateful';
import { BlueprintsStatelessStack } from '../stateless/stateless';
import { getStage } from '../utils';

const stage = getStage(process.env.STAGE as Stage) as Stage;
const appConfig = getEnvironmentConfig(stage);

const app = new cdk.App({
  propertyInjectors: [new S3BucketInjector(), new RestApiInjector()],
});

new BlueprintsStatefulStack(app, 'BlueprintsStatefulStack', {
  env: appConfig.env,
  shared: appConfig.shared,
});

new BlueprintsStatelessStack(app, 'BlueprintsStatelessStack', {
  env: appConfig.env,
  shared: appConfig.shared,
});
