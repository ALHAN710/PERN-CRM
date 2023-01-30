import Joi, { AnySchema } from "joi";

export const registerSchema: AnySchema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().max(50).required(),
    password: Joi.string().min(8).required(),
    roles: Joi.array().items(Joi.string().valid(...["ADMIN", "INVOICER", "USER", "DEMO"]).required()).unique().required(),
});

export const accountSchema: AnySchema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50),
    // email: Joi.string().email().max(50),
    roles: Joi.array().items(Joi.string().valid(...["ADMIN", "INVOICER", "USER", "DEMO"]).required()).unique(),
}); 

/*export const profileSchema: AnySchema = Joi.object({
    avatar: Joi.string().email().max(50).required(),
    password: Joi.string().min(8).required(),
}); */

export const loginSchema = Joi.object({
    email: Joi.string().email().max(50).required(),
    password: Joi.string().min(8).required(),
});

export const customerSchema = Joi.object({
    firstName: Joi.string().min(3).max(100).required(),
    lastName: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().max(50).required(),
    company: Joi.string().max(100).allow(...["", null]).optional(),
});

export const customerUpdateSchema = Joi.object({
    firstName: Joi.string().min(3).max(100),
    lastName: Joi.string().min(3).max(100),
    email: Joi.string().email().max(50),
    company: Joi.string().max(100).allow(...["", null]).optional(),
});

export const invoiceSchema = Joi.object({
    amount: Joi.number().positive().required(),
    // sentAt: Joi.date().optional(),
    status: Joi.string().valid(...['SENT', "PAID", "CANCELLED"]).required(),
    customerId: Joi.string().uuid().required(),

});

export const invoiceUpdateSchema = Joi.object({
    amount: Joi.number().positive(),
    // sentAt: Joi.date().optional(),
    status: Joi.string().valid(...['SENT', "PAID", "CANCELLED"]),
    customerId: Joi.string().uuid(),
});