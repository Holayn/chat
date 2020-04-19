import aws from 'aws-sdk';

import client from '../client';

export default (params: any) => {
  return new Promise<aws.DynamoDB.DocumentClient.QueryOutput>((resolve, reject) => {
    client.query(params, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(data);
    });
  });
}