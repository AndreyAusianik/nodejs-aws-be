import type { AWS } from '@serverless/typescript';

import * as functions from '@functions/index';
import environment from './env';

const serverlessConfiguration: AWS = {
  service: 'nodejs-aws-be',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment,
    lambdaHashingVersion: '20201221',
  },
  functions,
};

module.exports = serverlessConfiguration;
