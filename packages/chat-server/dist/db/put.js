"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = __importDefault(require("../client"));
exports.default = (function (params) {
    return new Promise(function (resolve, reject) {
        client_1.default.put(params, function (err, data) {
            if (err) {
                console.error(err);
                reject(err);
            }
            resolve(data);
        });
    });
});
