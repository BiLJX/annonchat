"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAccountSetup = exports.authenticateUser = exports.getLoginStatus = exports.loginUser = exports.signupUser = void 0;
var IdGen_1 = require("lib/IdGen");
var Response_1 = __importDefault(require("lib/Response"));
var User_model_1 = require("models/User.model");
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var expiresIn = 60 * 60 * 24 * 14 * 1000;
var options = { maxAge: expiresIn, httpOnly: false };
var generateToken = function (user_id) { return jsonwebtoken_1.default.sign({ user_id: user_id }, process.env.USER_SESSION_JWT || "", { expiresIn: '10d' }); };
var signupUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jsonResponse, _a, password, restBody, username, foundUser, salt, hashedPassword, user, savedUser, token, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                jsonResponse = new Response_1.default(res);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                _a = req.body, password = _a.password, restBody = __rest(_a, ["password"]);
                username = restBody.username.toLowerCase();
                restBody.username = restBody.username.toLowerCase();
                if (username.length < 3)
                    return [2 /*return*/, jsonResponse.clientError("Username should be more than 3 letters")];
                return [4 /*yield*/, User_model_1.User.findOne({ username: username })];
            case 2:
                foundUser = _b.sent();
                if (foundUser)
                    return [2 /*return*/, jsonResponse.clientError("Username already taken")];
                if (!password)
                    return [2 /*return*/, jsonResponse.clientError("Please enter password")];
                if (password.length < 8)
                    return [2 /*return*/, jsonResponse.clientError("Password should be more than 8 charecters")];
                return [4 /*yield*/, bcrypt_1.default.genSalt(10)];
            case 3:
                salt = _b.sent();
                return [4 /*yield*/, bcrypt_1.default.hash(password, salt)];
            case 4:
                hashedPassword = _b.sent();
                user = new User_model_1.User(__assign({ is_verified: false, user_id: (0, IdGen_1.makeId)(), password: hashedPassword }, restBody));
                return [4 /*yield*/, user.save()];
            case 5:
                _b.sent();
                savedUser = user.toJSON();
                delete savedUser.password;
                delete savedUser.email;
                token = generateToken(user.user_id);
                res.cookie("session", token, options);
                jsonResponse.success(savedUser);
                return [3 /*break*/, 7];
            case 6:
                error_1 = _b.sent();
                console.log(error_1);
                jsonResponse.serverError();
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.signupUser = signupUser;
var loginUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jsonResponse, _a, username, password, user, isPasswordValid, token, savedUser, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                jsonResponse = new Response_1.default(res);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                _a = req.body, username = _a.username, password = _a.password;
                return [4 /*yield*/, User_model_1.User.findOne({ username: username })];
            case 2:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, jsonResponse.clientError("No user found")];
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 3:
                isPasswordValid = _b.sent();
                if (!isPasswordValid) {
                    return [2 /*return*/, jsonResponse.clientError('Invalid password')];
                }
                token = generateToken(user.user_id);
                res.cookie("session", token, options);
                savedUser = user.toJSON();
                delete savedUser.password;
                delete savedUser.email;
                jsonResponse.success(savedUser);
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                console.log(error_2);
                jsonResponse.serverError();
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.loginUser = loginUser;
var getLoginStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jsonResponse;
    return __generator(this, function (_a) {
        jsonResponse = new Response_1.default(res);
        try {
            jsonResponse.success(res.locals.user);
        }
        catch (error) {
            console.log(error);
            jsonResponse.serverError();
        }
        return [2 /*return*/];
    });
}); };
exports.getLoginStatus = getLoginStatus;
//middleware
var authenticateUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var jsonResponse, token, user_id, user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jsonResponse = new Response_1.default(res);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                token = req.cookies.session;
                if (!token)
                    return [2 /*return*/, jsonResponse.notAuthorized()];
                user_id = jsonwebtoken_1.default.verify(token, process.env.USER_SESSION_JWT || "").user_id;
                if (!user_id)
                    return [2 /*return*/, jsonResponse.notAuthorized()];
                return [4 /*yield*/, User_model_1.User.findOne({ user_id: user_id }).select("-password -email")];
            case 2:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, jsonResponse.clientError("User not found")];
                res.locals.user = user.toJSON();
                next === null || next === void 0 ? void 0 : next();
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.log(error_3);
                jsonResponse.serverError();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.authenticateUser = authenticateUser;
var checkAccountSetup = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var jsonResponse, user;
    return __generator(this, function (_a) {
        jsonResponse = new Response_1.default(res);
        try {
            user = res.locals.user;
            if (!user.account_setup)
                return [2 /*return*/, jsonResponse.notAuthorized("Please setup your account")];
            next === null || next === void 0 ? void 0 : next();
        }
        catch (error) {
            console.log(error);
            jsonResponse.serverError();
        }
        return [2 /*return*/];
    });
}); };
exports.checkAccountSetup = checkAccountSetup;
