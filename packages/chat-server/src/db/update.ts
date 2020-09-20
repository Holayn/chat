import awsSdk from 'aws-sdk';

import client from '../client';

export default (params: any) => {
  return new Promise<awsSdk.DynamoDB.DocumentClient.UpdateItemOutput>((resolve, reject) => {
    client.update(params, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(data);
    });
  });
};
