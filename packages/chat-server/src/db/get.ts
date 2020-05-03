import awsSdk from 'aws-sdk';

import client from '../client';

export default (params: any) => {
  return new Promise<awsSdk.DynamoDB.AttributeMap>((resolve, reject) => {
    client.get(params, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(data.Item);
    });
  });
};
