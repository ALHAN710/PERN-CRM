"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnprocessableError = void 0;
const custom_error_1 = require("./custom-error");
class UnprocessableError extends custom_error_1.CustomError {
    constructor(resource, action = "create", mess) {
        super(`Can't ${action} ${resource} Resource`);
        this.resource = resource;
        this.action = action;
        this.mess = mess;
        this.statusCode = 422;
        Object.setPrototypeOf(this, UnprocessableError.prototype);
    }
    serializeErrors() {
        var _a;
        return [{ message: (_a = this.mess) !== null && _a !== void 0 ? _a : `Can't ${this.action} ${this.resource} Resource` }];
    }
}
exports.UnprocessableError = UnprocessableError;
//# sourceMappingURL=unprocessable-error.js.map