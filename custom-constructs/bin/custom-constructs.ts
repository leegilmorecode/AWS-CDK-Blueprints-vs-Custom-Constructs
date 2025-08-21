#!/usr/bin/env node

import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';

import { Stage } from 'types';
import { getEnvironmentConfig } from '../app-config';
import { CustomConstructsStatefulStack } from '../stateful/stateful';
import { CustomConstructsStatelessStack } from '../stateless/stateless';
import { getStage } from '../utils';

const stage = getStage(process.env.STAGE as Stage) as Stage;
const appConfig = getEnvironmentConfig(stage);

const app = new cdk.App();
new CustomConstructsStatefulStack(app, 'CustomConstructsStatefulStack', {
  env: appConfig.env,
  shared: appConfig.shared,
});

new CustomConstructsStatelessStack(app, 'CustomConstructsStatelessStack', {
  env: appConfig.env,
  shared: appConfig.shared,
});
