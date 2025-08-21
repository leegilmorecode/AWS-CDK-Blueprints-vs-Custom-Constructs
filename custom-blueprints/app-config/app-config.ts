import { Region, Stage } from '../types';

export interface EnvironmentConfig {
  shared: {
    stage: Stage;
    serviceName: string;
    metricNamespace: string;
    logging: {
      logLevel: 'DEBUG' | 'INFO' | 'ERROR';
      logEvent: 'true' | 'false';
    };
  };
  env: {
    account: string;
    region: string;
  };
  stateless: {};
  stateful: {};
}

export const getEnvironmentConfig = (stage: Stage): EnvironmentConfig => {
  switch (stage) {
    case Stage.test:
      return {
        shared: {
          logging: {
            logLevel: 'DEBUG',
            logEvent: 'true',
          },
          serviceName: `example-service-${Stage.test}`,
          metricNamespace: `example-namespace-${Stage.test}`,
          stage: Stage.test,
        },
        stateless: {},
        env: {
          account: '123456789123',
          region: Region.london,
        },
        stateful: {},
      };
    case Stage.staging:
      return {
        shared: {
          logging: {
            logLevel: 'DEBUG',
            logEvent: 'true',
          },
          serviceName: `example-service-${Stage.staging}`,
          metricNamespace: `example-namespace-${Stage.staging}`,
          stage: Stage.staging,
        },
        stateless: {},
        env: {
          account: '123456789123',
          region: Region.london,
        },
        stateful: {},
      };
    case Stage.prod:
      return {
        shared: {
          logging: {
            logLevel: 'INFO',
            logEvent: 'true',
          },
          serviceName: `example-service-${Stage.prod}`,
          metricNamespace: `example-namespace-${Stage.prod}`,
          stage: Stage.prod,
        },
        stateless: {},
        env: {
          account: '123456789123',
          region: Region.london,
        },
        stateful: {},
      };
    case Stage.develop:
      return {
        shared: {
          logging: {
            logLevel: 'DEBUG',
            logEvent: 'true',
          },
          serviceName: `example-service-${Stage.develop}`,
          metricNamespace: `example-namespace-${Stage.develop}`,
          stage: Stage.develop,
        },
        stateless: {},
        env: {
          account: '123456789123',
          region: Region.london,
        },
        stateful: {},
      };
    default:
      return {
        shared: {
          logging: {
            logLevel: 'DEBUG',
            logEvent: 'true',
          },
          serviceName: `example-service-${stage}`,
          metricNamespace: `example-namespace-${stage}`,
          stage: stage,
        },
        stateless: {},
        env: {
          account: '123456789123',
          region: Region.london,
        },
        stateful: {},
      };
  }
};
