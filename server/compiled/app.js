"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
require("dotenv/config");
var mongoose_1 = __importDefault(require("mongoose"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var main_routes_1 = require("routes/main.routes");
var cloudinary_1 = require("cloudinary");
var socket_io_1 = require("socket.io");
var User_model_1 = require("models/User.model");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var socketEvents_type_1 = require("@shared/sockets/socketEvents.type");
var match_handler_1 = require("handlers/match.handler");
var redis_1 = require("lib/redis");
var chat_handler_1 = require("handlers/chat.handler");
var call_handler_1 = require("handlers/call.handler");
var path_1 = __importDefault(require("path"));
var PORT = process.env.PORT || 4000;
var app = (0, express_1.default)();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({ credentials: true, origin: true, }));
app.use(express_1.default.static(path_1.default.join("dist")));
app.use("/api", main_routes_1.ApiRoutes);
app.get("/*", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "..", "dist", "index.html"));
});
console.log("Connecting to MongoDB...");
mongoose_1.default.connect(process.env.MONGO_URI || "").then(main);
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var server, io;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Connected to MongoDB");
                    console.log("Connecting to Redis...");
                    return [4 /*yield*/, redis_1.redis.connect()];
                case 1:
                    _a.sent();
                    console.log("Connected to Redis");
                    console.log("Starting Server...");
                    server = app.listen(PORT, function () {
                        console.log("Listening on port...", PORT);
                    });
                    io = new socket_io_1.Server(server, {
                        cors: {
                            origin: "*",
                            credentials: true,
                        }
                    });
                    io.use(function (socket, next) { return __awaiter(_this, void 0, void 0, function () {
                        var token, user_id, user, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    token = socket.handshake.query.token;
                                    if (!token)
                                        return [2 /*return*/, next(new Error("Not Authorized"))];
                                    user_id = jsonwebtoken_1.default.verify(token, process.env.USER_SESSION_JWT || "").user_id;
                                    return [4 /*yield*/, User_model_1.User.findOne({ user_id: user_id })];
                                case 1:
                                    user = _a.sent();
                                    if (!user)
                                        return [2 /*return*/, next(new Error("Not Authorized"))];
                                    socket.user_id = user.user_id;
                                    return [2 /*return*/, next()];
                                case 2:
                                    error_1 = _a.sent();
                                    console.log(error_1);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    io.on(socketEvents_type_1.SocketEvents.CONNECT, function (socket) {
                        socket.join(socket.user_id);
                        (0, match_handler_1.matchHandler)(io, socket);
                        (0, chat_handler_1.chatHandler)(io, socket);
                        (0, call_handler_1.callMatchHandler)(io, socket);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
