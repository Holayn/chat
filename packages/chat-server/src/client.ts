import awsSdk from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const credentials = new awsSdk.Credentials(
  process.env.access_key_id || '',
  process.env.secret_access_key || ''
);
const config = new awsSdk.Config({
  credentials,
  region: 'us-east-2'
});

export default new awsSdk.DynamoDB.DocumentClient(config);
