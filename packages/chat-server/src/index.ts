import aws from 'aws-sdk';

const credentials = new aws.Credentials(process.env.access_key_id || '', process.env.secret_access_key || '');
const config = new aws.Config({
  region: 'us-east-2',
  credentials,
});

const docClient = new aws.DynamoDB.DocumentClient(config);

const params = {
  TableName: "session",
}

docClient.scan(params, (err, data) => {
  if (err) {
    console.error(err);
  }
  console.log(data);
})