import aws from 'aws-sdk';
import express from 'express';

const PORT = process.env.PORT || 8000;

const credentials = new aws.Credentials(process.env.access_key_id || '', process.env.secret_access_key || '');
const config = new aws.Config({
  region: 'us-east-2',
  credentials,
});

const docClient = new aws.DynamoDB.DocumentClient(config);

const server = express();
server.listen(PORT, () => {
  console.log('server listening on 8000')
})

server.get('/sessions', (req: any, res: any) => {
  const params = {
    TableName: 'session',
  }
  
  docClient.scan(params, (err, data) => {
    if (err) {
      console.error(err);
      res.send(500);
      return;
    }
    console.log(data);
    res.send(data);
  });
})

server.get('/chats', (req: any, res: any) => {
  const params = {
    TableName: 'chat',
    KeyConditionExpression: '#s = :s',
    ExpressionAttributeValues: {
      ':s': `${req.query.session_id}`,
    },
    ExpressionAttributeNames: {
      '#s': 'session-id'
    }
  }

  docClient.query(params, (err, data) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
    console.log(data);
    res.send(data);
  })
})
