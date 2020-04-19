import awsSdk from 'aws-sdk';

import client from '../client';

export default (params: any) => {
  return new Promise<awsSdk.DynamoDB.DocumentClient.QueryOutput>((resolve, reject) => {
    client.query(params, (err: any, data: any) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(data);
    });
  });
};
