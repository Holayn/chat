"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var sockets = __importStar(require("socket.io"));
var logger_1 = __importDefault(require("./utils/logger"));
// routes
var session_1 = __importDefault(require("./routes/session"));
var chat_1 = __importDefault(require("./routes/chat"));
var user_1 = __importDefault(require("./routes/user"));
var PORT = process.env.PORT || 8000;
var app = express_1.default();
var connectedUsers = {};
var connectedSockets = {};
app.use(logger_1.default);
app.use('/sessions', session_1.default);
app.use('/chats', chat_1.default);
app.use('/users', user_1.default);
var server = app.listen(PORT, function () {
    console.log('server listening on 8000');
});
var io = sockets.listen(server);
io.on('connection', function (socket) {
    console.log('client connected');
    console.log(socket.handshake.query);
    socket.emit('ack', { msg: 'connected to server' });
});
// io.on('disconnect', function(socket) {
// })
