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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callMatchHandler = exports.CallMatchKeys = void 0;
var socketEvents_type_1 = require("@shared/sockets/socketEvents.type");
var IdGen_1 = require("lib/IdGen");
var redis_1 = require("lib/redis");
var User_model_1 = require("models/User.model");
var CallMatchKeys;
(function (CallMatchKeys) {
    CallMatchKeys["INDIVIDUAL_QUEUE"] = "call-matchmakingIndividualQueue";
    CallMatchKeys["GROUP_QUEUE"] = "call-matchmakingGroupQueue";
    CallMatchKeys["ROOM_MAP"] = "call-roomMap:";
    CallMatchKeys["LOCK_USER"] = "lock";
    CallMatchKeys["PEER_MAP"] = "peer-id:";
})(CallMatchKeys || (exports.CallMatchKeys = CallMatchKeys = {}));
var getRoomId = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var key;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                key = "".concat(CallMatchKeys.ROOM_MAP).concat(userId);
                return [4 /*yield*/, redis_1.redis.get(key)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var leaveQueue = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, redis_1.redis.lRem(CallMatchKeys.INDIVIDUAL_QUEUE, 1, userId)];
            case 1:
                _a.sent();
                return [4 /*yield*/, redis_1.redis.lRem(CallMatchKeys.GROUP_QUEUE, 1, userId)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var lockUser = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, redis_1.redis.set("".concat(CallMatchKeys.LOCK_USER).concat(userId), "locked", {
                    EX: 10,
                    NX: true
                })];
            case 1: return [2 /*return*/, !(_a.sent())];
        }
    });
}); };
var setPeerId = function (userId, peerId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, redis_1.redis.set("".concat(CallMatchKeys.PEER_MAP).concat(userId), peerId)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var getPeerId = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, redis_1.redis.get("".concat(CallMatchKeys.PEER_MAP).concat(userId))];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var removePeerId = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, redis_1.redis.del("".concat(CallMatchKeys.PEER_MAP).concat(userId))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var unlockUser = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, redis_1.redis.del("".concat(CallMatchKeys.LOCK_USER).concat(userId))];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var callMatchHandler = function (io, socket) {
    var userId = socket.user_id;
    var joinRoom = function (members, roomId) { return __awaiter(void 0, void 0, void 0, function () {
        var _i, members_1, memberId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, members_1 = members;
                    _a.label = 1;
                case 1:
                    if (!(_i < members_1.length)) return [3 /*break*/, 4];
                    memberId = members_1[_i];
                    io.in(memberId).socketsJoin(roomId);
                    return [4 /*yield*/, redis_1.redis.set("".concat(CallMatchKeys.ROOM_MAP).concat(memberId), roomId)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var leaveRoom = function (userId, roomId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    socket.leave(roomId);
                    return [4 /*yield*/, redis_1.redis.del("".concat(CallMatchKeys.ROOM_MAP).concat(userId))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleIndividual = function () { return __awaiter(void 0, void 0, void 0, function () {
        var matchUserId, isLocked, matchUser, currentUser, myPeerId, matchPeerId, roomId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, redis_1.redis.rPop(CallMatchKeys.INDIVIDUAL_QUEUE)];
                case 1:
                    matchUserId = _a.sent();
                    if (!(!matchUserId && matchUserId !== userId)) return [3 /*break*/, 3];
                    return [4 /*yield*/, redis_1.redis.lPush(CallMatchKeys.INDIVIDUAL_QUEUE, userId)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
                case 3: return [4 /*yield*/, lockUser(matchUserId)];
                case 4:
                    isLocked = _a.sent();
                    if (isLocked) {
                        console.log("User Locked");
                        handleIndividual();
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, User_model_1.User.aggregate([
                            { $match: { user_id: matchUserId } },
                            { $project: { password: 0, email: 0 } }
                        ])];
                case 5:
                    matchUser = _a.sent();
                    return [4 /*yield*/, User_model_1.User.aggregate([
                            { $match: { user_id: userId } },
                            { $project: { password: 0, email: 0 } }
                        ])];
                case 6:
                    currentUser = _a.sent();
                    if (!currentUser || matchUser.length === 0)
                        return [2 /*return*/];
                    return [4 /*yield*/, getPeerId(userId)];
                case 7:
                    myPeerId = _a.sent();
                    return [4 /*yield*/, getPeerId(matchUser[0].user_id)];
                case 8:
                    matchPeerId = _a.sent();
                    if (!myPeerId || !matchPeerId)
                        return [2 /*return*/];
                    matchUser[0].peer_id = matchPeerId;
                    currentUser[0].peer_id = myPeerId;
                    roomId = (0, IdGen_1.makeId)();
                    return [4 /*yield*/, leaveQueue(userId)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, leaveQueue(matchUserId)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, joinRoom([userId, matchUserId], roomId)];
                case 11:
                    _a.sent();
                    io.to(roomId).emit(socketEvents_type_1.SocketCallEvents.MATCH_FOUND, {
                        users: __spreadArray(__spreadArray([], currentUser, true), matchUser, true),
                        room_id: roomId
                    });
                    return [4 /*yield*/, unlockUser(matchUserId)];
                case 12:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleGroup = function () { return __awaiter(void 0, void 0, void 0, function () {
        var GROUP_MEMBERS_LIMIT, matchUserIds, _i, matchUserIds_1, id, isLocked, users, roomId, _a, users_1, user, _b, _c, matchUserIds_2, id;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    GROUP_MEMBERS_LIMIT = 3;
                    return [4 /*yield*/, redis_1.redis.lRange(CallMatchKeys.GROUP_QUEUE, 0, GROUP_MEMBERS_LIMIT - 1)];
                case 1:
                    matchUserIds = _d.sent();
                    if (!(matchUserIds.length < GROUP_MEMBERS_LIMIT - 1)) return [3 /*break*/, 3];
                    return [4 /*yield*/, redis_1.redis.lPush(CallMatchKeys.GROUP_QUEUE, userId)];
                case 2:
                    _d.sent();
                    return [2 /*return*/];
                case 3:
                    _i = 0, matchUserIds_1 = matchUserIds;
                    _d.label = 4;
                case 4:
                    if (!(_i < matchUserIds_1.length)) return [3 /*break*/, 7];
                    id = matchUserIds_1[_i];
                    return [4 /*yield*/, lockUser(id)];
                case 5:
                    isLocked = _d.sent();
                    if (isLocked) {
                        handleGroup();
                        console.log("User Locked");
                        return [2 /*return*/];
                    }
                    _d.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7: return [4 /*yield*/, User_model_1.User.aggregate([
                        { $match: { user_id: { $in: __spreadArray([userId], matchUserIds, true) } } },
                        { $project: { password: 0, email: 0 } }
                    ])];
                case 8:
                    users = _d.sent();
                    if (users.length <= 1)
                        return [2 /*return*/];
                    roomId = (0, IdGen_1.makeId)();
                    return [4 /*yield*/, joinRoom(__spreadArray(__spreadArray([], matchUserIds, true), [userId], false), roomId)];
                case 9:
                    _d.sent();
                    _a = 0, users_1 = users;
                    _d.label = 10;
                case 10:
                    if (!(_a < users_1.length)) return [3 /*break*/, 13];
                    user = users_1[_a];
                    _b = user;
                    return [4 /*yield*/, getPeerId(user.user_id)];
                case 11:
                    _b.peer_id = (_d.sent()) || "";
                    _d.label = 12;
                case 12:
                    _a++;
                    return [3 /*break*/, 10];
                case 13: return [4 /*yield*/, leaveQueue(userId)];
                case 14:
                    _d.sent();
                    io.to(roomId).emit(socketEvents_type_1.SocketCallEvents.MATCH_FOUND, { users: users, room_id: roomId });
                    _c = 0, matchUserIds_2 = matchUserIds;
                    _d.label = 15;
                case 15:
                    if (!(_c < matchUserIds_2.length)) return [3 /*break*/, 18];
                    id = matchUserIds_2[_c];
                    return [4 /*yield*/, leaveQueue(id)];
                case 16:
                    _d.sent();
                    _d.label = 17;
                case 17:
                    _c++;
                    return [3 /*break*/, 15];
                case 18: return [2 /*return*/];
            }
        });
    }); };
    var handleMatchFind = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var roomId, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    return [4 /*yield*/, getRoomId(userId)];
                case 1:
                    roomId = _a.sent();
                    if (!roomId) return [3 /*break*/, 3];
                    return [4 /*yield*/, leaveRoom(userId, roomId)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [4 /*yield*/, leaveQueue(userId)];
                case 4:
                    _a.sent();
                    if (!(data.type === "individual")) return [3 /*break*/, 6];
                    return [4 /*yield*/, handleIndividual()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, handleGroup()];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_1 = _a.sent();
                    console.error("Error handling match find:", error_1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    var handleCancel = function () { return __awaiter(void 0, void 0, void 0, function () {
        var roomId, user, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, leaveQueue(userId)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, unlockUser(userId)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, getRoomId(userId)];
                case 3:
                    roomId = _a.sent();
                    if (!roomId)
                        return [2 /*return*/];
                    return [4 /*yield*/, leaveRoom(userId, roomId)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, User_model_1.User.findOne({ user_id: userId })];
                case 5:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/];
                    io.to(roomId).emit(socketEvents_type_1.SocketCallEvents.MATCH_CANCEL, { user_id: userId, username: user.toJSON().username });
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.error("Error handling cancel:", error_2);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handlePeerJoin = function (peerId) { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!peerId)
                        return [2 /*return*/];
                    return [4 /*yield*/, setPeerId(userId, peerId)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error("Error handling peer join:", error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    socket.on(socketEvents_type_1.SocketCallEvents.MATCH_FIND, handleMatchFind);
    socket.on(socketEvents_type_1.SocketCallEvents.PEER_ID, handlePeerJoin);
    socket.on(socketEvents_type_1.SocketCallEvents.MATCH_CANCEL, handleCancel);
    socket.on(socketEvents_type_1.SocketEvents.DISCONNECT, handleCancel);
    socket.on(socketEvents_type_1.SocketCallEvents.MATCH_FIND_CANCEL, handleCancel);
    socket.on(socketEvents_type_1.SocketEvents.DISCONNECT, function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, removePeerId(userId)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.callMatchHandler = callMatchHandler;
