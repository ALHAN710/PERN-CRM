"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const custom_error_1 = require("../errors/custom-error");
const errorHandler = (err, req, res, next) => {
    console.log("================ Error Handler Middleware ================");
    if (err instanceof SyntaxError) {
        // console.log("message", err.message);
        // console.log("name", err.name);
        // console.log("stack", err.stack);
        // throw new BadRequestError(err.message);
        res.status(400).json({ message: err.message });
    }
    console.log(err);
    if (err instanceof custom_error_1.CustomError) {
        return res.status(err.statusCode).json({ errors: err.serializeErrors() });
    }
    res.status(500).json({
        errors: [{ message: "Something went wrong" }],
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.js.map