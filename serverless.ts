import type { AWS } from '@serverless/typescript';

import { addElevator, getElevators } from './src/functions';

const serverlessConfiguration: AWS = {
  service: 'elevator-backend',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [ "s3:PutObject", "s3:GetObject" ],
            Resource:[
              "arn:aws:s3:::elevator-data-json/*"
            ],
          },
        ],
      },
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { addElevator, getElevators }
}

module.exports = serverlessConfiguration;
