"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var express_1 = __importDefault(require("express"));
var PORT = process.env.PORT || 8000;
var credentials = new aws_sdk_1.default.Credentials(process.env.access_key_id || '', process.env.secret_access_key || '');
var config = new aws_sdk_1.default.Config({
    region: 'us-east-2',
    credentials: credentials,
});
var docClient = new aws_sdk_1.default.DynamoDB.DocumentClient(config);
var server = express_1.default();
server.listen(PORT, function () {
    console.log('server listening on 8000');
});
server.get('/sessions', function (req, res) {
    var params = {
        TableName: 'session',
    };
    docClient.scan(params, function (err, data) {
        if (err) {
            console.error(err);
            res.send(500);
            return;
        }
        console.log(data);
        res.send(data);
    });
});
server.get('/chats', function (req, res) {
    var params = {
        TableName: 'chat',
        KeyConditionExpression: '#s = :s',
        ExpressionAttributeValues: {
            ':s': "" + req.query.session_id,
        },
        ExpressionAttributeNames: {
            '#s': 'session-id'
        }
    };
    docClient.query(params, function (err, data) {
        if (err) {
            console.error(err);
            res.sendStatus(500);
            return;
        }
        console.log(data);
        res.send(data);
    });
});
