"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnAuthenticatedError = void 0;
const custom_error_1 = require("./custom-error");
class UnAuthenticatedError extends custom_error_1.CustomError {
    constructor(mess) {
        super("UnAuthenticated");
        this.mess = mess;
        this.statusCode = 401;
        Object.setPrototypeOf(this, UnAuthenticatedError.prototype);
    }
    serializeErrors() {
        return [{ message: this.mess || "UnAuthenticated", status: this.statusCode }];
    }
}
exports.UnAuthenticatedError = UnAuthenticatedError;
//# sourceMappingURL=unauthenticated-error.js.map