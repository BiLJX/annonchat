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
exports.matchHandler = exports.MatchKeys = void 0;
var socketEvents_type_1 = require("@shared/sockets/socketEvents.type");
var IdGen_1 = require("lib/IdGen");
var redis_1 = require("lib/redis");
var User_model_1 = require("models/User.model");
var MatchKeys;
(function (MatchKeys) {
    MatchKeys["INDVIDUAL_QUE"] = "matchmakingIndieQue";
    MatchKeys["GROUP_QUE"] = "matchmakingGroupQue";
    MatchKeys["ROOM_MAP"] = "roomMap:";
    MatchKeys["LOCK_USER"] = "lock";
})(MatchKeys || (exports.MatchKeys = MatchKeys = {}));
var getRoomId = function (user_id) { return __awaiter(void 0, void 0, void 0, function () {
    var key;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                key = MatchKeys.ROOM_MAP + user_id;
                return [4 /*yield*/, redis_1.redis.get(key)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var leaveQue = function (user_id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, redis_1.redis.lRem(MatchKeys.INDVIDUAL_QUE, 1, user_id)];
            case 1:
                _a.sent();
                return [4 /*yield*/, redis_1.redis.lRem(MatchKeys.GROUP_QUE, 1, user_id)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var lockUser = function (user_id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, redis_1.redis.set(MatchKeys.LOCK_USER + user_id, "locked", {
                    EX: 10,
                    NX: true
                })];
            case 1: return [2 /*return*/, !(_a.sent())];
        }
    });
}); };
var unlockUser = function (user_id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, redis_1.redis.del(MatchKeys.LOCK_USER + user_id)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var matchHandler = function (io, socket) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, joinRoom, leaveRoom, handleIndividual, handleGroup, handleCancel;
    return __generator(this, function (_a) {
        user_id = socket.user_id;
        joinRoom = function (members, room_id) { return __awaiter(void 0, void 0, void 0, function () {
            var _i, members_1, member_id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, members_1 = members;
                        _a.label = 1;
                    case 1:
                        if (!(_i < members_1.length)) return [3 /*break*/, 4];
                        member_id = members_1[_i];
                        io.in(member_id).socketsJoin(room_id);
                        return [4 /*yield*/, redis_1.redis.set(MatchKeys.ROOM_MAP + member_id, room_id)];
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
        leaveRoom = function (user_id, room_id) { return __awaiter(void 0, void 0, void 0, function () {
            var map_key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        socket.leave(room_id);
                        map_key = MatchKeys.ROOM_MAP + user_id;
                        return [4 /*yield*/, redis_1.redis.del(map_key)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        handleIndividual = function () { return __awaiter(void 0, void 0, void 0, function () {
            var match_user_id, isLocked, user, current_user, room_id, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, redis_1.redis.rPop(MatchKeys.INDVIDUAL_QUE)];
                    case 1:
                        match_user_id = _a.sent();
                        if (!(!match_user_id && match_user_id !== user_id)) return [3 /*break*/, 3];
                        return [4 /*yield*/, redis_1.redis.lPush(MatchKeys.INDVIDUAL_QUE, user_id)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                    case 3: return [4 /*yield*/, lockUser(match_user_id)];
                    case 4:
                        isLocked = _a.sent();
                        if (isLocked)
                            return [2 /*return*/, console.log("User Locked")];
                        return [4 /*yield*/, User_model_1.User.aggregate([
                                {
                                    $match: {
                                        user_id: match_user_id
                                    },
                                },
                                {
                                    $project: {
                                        password: 0,
                                        email: 0
                                    }
                                }
                            ])];
                    case 5:
                        user = _a.sent();
                        return [4 /*yield*/, User_model_1.User.aggregate([
                                {
                                    $match: {
                                        user_id: user_id
                                    }
                                },
                                {
                                    $project: {
                                        password: 0,
                                        email: 0
                                    }
                                }
                            ])];
                    case 6:
                        current_user = _a.sent();
                        if (!current_user)
                            return [2 /*return*/];
                        if (user.length === 0)
                            return [2 /*return*/];
                        room_id = (0, IdGen_1.makeId)();
                        return [4 /*yield*/, leaveQue(user_id)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, leaveQue(match_user_id)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, joinRoom([user_id, match_user_id], room_id)];
                    case 9:
                        _a.sent();
                        res = {
                            users: __spreadArray(__spreadArray([], current_user, true), user, true),
                            room_id: room_id
                        };
                        io.to(room_id).emit(socketEvents_type_1.SocketEvents.MATCH_FOUND, res);
                        return [4 /*yield*/, unlockUser(match_user_id)];
                    case 10:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        handleGroup = function () { return __awaiter(void 0, void 0, void 0, function () {
            var GROUP_MEMBERS_LIMIT, match_user_ids, _i, match_user_ids_1, id, isLocked, users, room_id, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        GROUP_MEMBERS_LIMIT = 3;
                        return [4 /*yield*/, redis_1.redis.lRange(MatchKeys.GROUP_QUE, 0, GROUP_MEMBERS_LIMIT - 1)];
                    case 1:
                        match_user_ids = _a.sent();
                        if (!(match_user_ids.length < GROUP_MEMBERS_LIMIT - 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, redis_1.redis.lPush(MatchKeys.GROUP_QUE, user_id)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                    case 3:
                        _i = 0, match_user_ids_1 = match_user_ids;
                        _a.label = 4;
                    case 4:
                        if (!(_i < match_user_ids_1.length)) return [3 /*break*/, 7];
                        id = match_user_ids_1[_i];
                        return [4 /*yield*/, lockUser(id)];
                    case 5:
                        isLocked = _a.sent();
                        if (isLocked) {
                            handleGroup();
                            return [2 /*return*/, console.log("User Locked")];
                        }
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [4 /*yield*/, User_model_1.User.aggregate([
                            {
                                $match: {
                                    user_id: {
                                        $in: __spreadArray([user_id], match_user_ids, true)
                                    }
                                }
                            },
                            {
                                $project: {
                                    password: 0,
                                    email: 0
                                }
                            }
                        ])];
                    case 8:
                        users = _a.sent();
                        if (users.length === 0)
                            return [2 /*return*/];
                        room_id = (0, IdGen_1.makeId)();
                        return [4 /*yield*/, joinRoom(__spreadArray(__spreadArray([], match_user_ids, true), [user_id], false), room_id)];
                    case 9:
                        _a.sent();
                        res = {
                            users: users,
                            room_id: room_id,
                        };
                        return [4 /*yield*/, leaveQue(user_id)];
                    case 10:
                        _a.sent();
                        io.to(room_id).emit(socketEvents_type_1.SocketEvents.MATCH_FOUND, res);
                        match_user_ids.forEach(function (x) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, leaveQue(x)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        }); };
        socket.on(socketEvents_type_1.SocketEvents.MATCH_FIND, function (data) { return __awaiter(void 0, void 0, void 0, function () {
            var room_id, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, getRoomId(user_id)];
                    case 1:
                        room_id = _a.sent();
                        if (!room_id) return [3 /*break*/, 3];
                        return [4 /*yield*/, leaveRoom(user_id, room_id)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, leaveQue(user_id)];
                    case 4:
                        _a.sent();
                        if (data.type === "individual") {
                            handleIndividual();
                        }
                        else {
                            handleGroup();
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
        handleCancel = function () { return __awaiter(void 0, void 0, void 0, function () {
            var room_id, user, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, leaveQue(user_id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, unlockUser(user_id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, getRoomId(user_id)];
                    case 3:
                        room_id = _a.sent();
                        if (!room_id)
                            return [2 /*return*/];
                        return [4 /*yield*/, leaveRoom(user_id, room_id)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, User_model_1.User.findOne({ user_id: user_id })];
                    case 5:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/];
                        io.to(room_id).emit(socketEvents_type_1.SocketEvents.MATCH_CANCEL, { user_id: user_id, username: user.toJSON().username });
                        return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        console.log(error_2);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        socket.on(socketEvents_type_1.SocketEvents.MATCH_CANCEL, handleCancel);
        socket.on(socketEvents_type_1.SocketEvents.DISCONNECT, handleCancel);
        socket.on(socketEvents_type_1.SocketEvents.MATCH_FIND_CANCEL, handleCancel);
        return [2 /*return*/];
    });
}); };
exports.matchHandler = matchHandler;
