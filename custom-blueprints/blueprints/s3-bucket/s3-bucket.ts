import { IPropertyInjector, InjectionContext } from 'aws-cdk-lib';
import { Bucket, BucketProps } from 'aws-cdk-lib/aws-s3';

/**
 * Enforces security defaults for all S3 Buckets
 */
export class S3BucketInjector implements IPropertyInjector {
  public readonly constructUniqueId: string;

  constructor() {
    // tell the CDK this injector applies to all Bucket constructs
    this.constructUniqueId = Bucket.PROPERTY_INJECTION_ID;
  }

  public inject(
    originalProps: BucketProps,
    _context: InjectionContext,
  ): BucketProps {
    const enforcedProps: Partial<BucketProps> = {
      enforceSSL: true,
      autoDeleteObjects: true,
      versioned: true,
    };

    // work out which props we're actually overriding
    const overridden = Object.entries(enforcedProps).filter(
      ([key, value]) =>
        (originalProps as any)[key] !== undefined &&
        (originalProps as any)[key] !== value,
    );

    if (overridden.length > 0) {
      const overriddenKeys = overridden.map(([key]) => key).join(', ');
      console.warn(
        `⚠️ The following S3 bucket props were overridden to enforce best practices: ${overriddenKeys}`,
      );
    }

    return {
      ...originalProps,
      ...enforcedProps,
    };
  }
}
