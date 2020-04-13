import aws from 'aws-sdk';

require('dotenv').config();

const credentials = new aws.Credentials(process.env.access_key_id || '', process.env.secret_access_key || '');
const config = new aws.Config({
  region: 'us-east-2',
  credentials,
});

export default new aws.DynamoDB.DocumentClient(config);
