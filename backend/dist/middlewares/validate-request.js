"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.params = exports.query = exports.body = void 0;
const joi_1 = __importDefault(require("joi"));
const request_validation_error_1 = require("../errors/request-validation-error");
const validate = (type) => {
    return (schema) => {
        return (req, res, next) => {
            const payload = req[type];
            let finalSchema;
            if (joi_1.default.isSchema(schema)) {
                finalSchema = schema;
            }
            else {
                finalSchema = joi_1.default.object(schema);
            }
            const { error } = finalSchema.validate(payload, { abortEarly: false });
            if (error) {
                const prefixes = {
                    body: "",
                    query: "The query parameter",
                    params: "The path parameter",
                };
                // console.log(error);
                const errors = error.details.map((detail) => {
                    var _a, _b;
                    return ({
                        message: `${prefixes[type]} ${detail.message}`,
                        field: (((_a = detail.context) === null || _a === void 0 ? void 0 : _a.label) || ((_b = detail.context) === null || _b === void 0 ? void 0 : _b.key)),
                    });
                });
                throw new request_validation_error_1.RequestValidationError(errors);
            }
            next();
        };
    };
};
exports.body = validate("body");
exports.query = validate("query");
exports.params = validate("params");
//# sourceMappingURL=validate-request.js.map