import awsSdk from 'aws-sdk';

import client from '../client';

export default (params: any) => {
  return new Promise<awsSdk.DynamoDB.PutItemOutput>((resolve, reject) => {
    client.put(params, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(data);
    });
  });
};
