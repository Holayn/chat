"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var logger_1 = __importDefault(require("./utils/logger"));
// routes
var session_1 = __importDefault(require("./routes/session"));
var chat_1 = __importDefault(require("./routes/chat"));
var user_1 = __importDefault(require("./routes/user"));
var PORT = process.env.PORT || 8000;
var server = express_1.default();
server.listen(PORT, function () {
    console.log('server listening on 8000');
});
server.use(logger_1.default);
server.use('/sessions', session_1.default);
server.use('/chats', chat_1.default);
server.use('/users', user_1.default);
