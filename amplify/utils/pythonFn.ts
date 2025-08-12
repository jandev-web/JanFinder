import * as path from 'path';
import { defineFunction } from '@aws-amplify/backend';
import { Duration, aws_lambda as lambda } from 'aws-cdk-lib';

type PythonFnOptions = {
  /** Folder containing handler.py (+ optional requirements.txt) */
  dir: string;
  /** "file.function" — defaults to handler.lambda_handler */
  handler?: string;
  environment?: Record<string, string>;
  memoryMB?: number;
  timeoutSeconds?: number;
};

export function pythonFn(name: string, opts: PythonFnOptions) {
  const {
    dir,
    handler = 'handler.lambda_handler',
    environment = {},
    memoryMB = 256,
    timeoutSeconds = 30,
  } = opts;

  return defineFunction((scope) => {
    const fn = new lambda.Function(scope, name, {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler,
      memorySize: memoryMB,
      timeout: Duration.seconds(timeoutSeconds),
      code: lambda.Code.fromAsset(path.join(__dirname, dir), {
        bundling: {
          image: lambda.Runtime.PYTHON_3_12.bundlingImage,
          command: [
            'bash', '-c',
            [
              'if [ -f requirements.txt ]; then pip install -r requirements.txt -t /asset-output; fi',
              'cp -R . /asset-output',
            ].join(' && ')
          ],
        },
      }),
      environment,
    });
    return fn;
  }, { resourceGroupName: 'functions' });
}
