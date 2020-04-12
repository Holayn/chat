"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var credentials = new aws_sdk_1.default.Credentials(process.env.access_key_id || '', process.env.secret_access_key || '');
var config = new aws_sdk_1.default.Config({
    region: 'us-east-2',
    credentials: credentials,
});
var docClient = new aws_sdk_1.default.DynamoDB.DocumentClient(config);
var params = {
    TableName: "session",
};
docClient.scan(params, function (err, data) {
    if (err) {
        console.error(err);
    }
    console.log(data);
});
