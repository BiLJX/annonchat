"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
var auth_controller_1 = require("controllers/auth.controller");
var user_controller_1 = require("controllers/user.controller");
var express_1 = require("express");
var router = (0, express_1.Router)();
exports.userRoutes = router;
router.put("/pfp", auth_controller_1.authenticateUser, user_controller_1.uploadPfp);
