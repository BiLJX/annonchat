"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsonResponse = /** @class */ (function () {
    function JsonResponse(res) {
        this.res = res;
    }
    JsonResponse.prototype.success = function (result, message) {
        if (result === void 0) { result = {}; }
        if (message === void 0) { message = "success"; }
        this.res.status(200).json({
            error: false,
            status: 200,
            result: result,
            message: message
        });
    };
    JsonResponse.prototype.serverError = function (message, result) {
        if (message === void 0) { message = "Internal Server Error"; }
        if (result === void 0) { result = null; }
        this.res.status(200).json({
            error: true,
            status: 500,
            result: result,
            message: message
        });
    };
    JsonResponse.prototype.notFound = function (message) {
        this.res.status(200).json({
            error: true,
            status: 404,
            result: null,
            message: message
        });
    };
    JsonResponse.prototype.notAuthorized = function (message) {
        if (message === void 0) { message = "Not authorized"; }
        this.res.status(200).json({
            error: true,
            status: 401,
            result: null,
            message: message
        });
    };
    JsonResponse.prototype.clientError = function (message, result) {
        if (result === void 0) { result = null; }
        this.res.status(200).json({
            error: true,
            status: 400,
            result: result,
            message: message
        });
    };
    return JsonResponse;
}());
exports.default = JsonResponse;
