"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceUpdateSchema = exports.invoiceSchema = exports.customerUpdateSchema = exports.customerSchema = exports.loginSchema = exports.accountSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(3).max(50).required(),
    lastName: joi_1.default.string().min(3).max(50).required(),
    email: joi_1.default.string().email().max(50).required(),
    password: joi_1.default.string().min(8).required(),
    roles: joi_1.default.array().items(joi_1.default.string().valid(...["ADMIN", "INVOICER", "USER", "DEMO"]).required()).unique().required(),
});
exports.accountSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(3).max(50).required(),
    lastName: joi_1.default.string().min(3).max(50),
    // email: Joi.string().email().max(50),
    roles: joi_1.default.array().items(joi_1.default.string().valid(...["ADMIN", "INVOICER", "USER", "DEMO"]).required()).unique(),
});
/*export const profileSchema: AnySchema = Joi.object({
    avatar: Joi.string().email().max(50).required(),
    password: Joi.string().min(8).required(),
}); */
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().max(50).required(),
    password: joi_1.default.string().min(8).required(),
});
exports.customerSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(3).max(100).required(),
    lastName: joi_1.default.string().min(3).max(100).required(),
    email: joi_1.default.string().email().max(50).required(),
    company: joi_1.default.string().max(100).optional(),
});
exports.customerUpdateSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(3).max(100),
    lastName: joi_1.default.string().min(3).max(100),
    email: joi_1.default.string().email().max(50),
    company: joi_1.default.string().max(100).optional(),
});
exports.invoiceSchema = joi_1.default.object({
    amount: joi_1.default.number().positive().required(),
    // sentAt: Joi.date().optional(),
    status: joi_1.default.string().valid(...['SENT', "PAID", "CANCELLED"]).required(),
    customerId: joi_1.default.string().uuid().required(),
});
exports.invoiceUpdateSchema = joi_1.default.object({
    amount: joi_1.default.number().positive(),
    // sentAt: Joi.date().optional(),
    status: joi_1.default.string().valid(...['SENT', "PAID", "CANCELLED"]),
    customerId: joi_1.default.string().uuid(),
});
//# sourceMappingURL=validation-schema.js.map