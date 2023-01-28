"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const custom_error_1 = require("./custom-error");
class NotFoundError extends custom_error_1.CustomError {
    constructor(resource) {
        super(`${resource !== null && resource !== void 0 ? resource : "Resource"} Not Found`);
        this.resource = resource;
        this.statusCode = 404;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializeErrors() {
        var _a;
        return [{ message: `${(_a = this.resource) !== null && _a !== void 0 ? _a : "Resource"} Not Found` }];
    }
}
exports.NotFoundError = NotFoundError;
//# sourceMappingURL=not-found-error.js.map