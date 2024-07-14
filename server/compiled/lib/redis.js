"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
var redis_1 = require("redis");
var client = (0, redis_1.createClient)({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || "0")
    }
});
exports.redis = client;
client.on('error', function (err) { return console.log('Redis Client Error', err); });
