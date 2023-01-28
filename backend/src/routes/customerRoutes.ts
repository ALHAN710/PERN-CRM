import express, { Request } from "express";
import { addCustomer, deleteCustomer, getCustomer, getCustomers, updateCustomer } from "../controllers/customerController";
import { requireAuth } from "../middlewares/require-auth";
import { body, params } from "../middlewares/validate-request";
import Joi from "joi";
import { customerSecurity, isGranted, userRoles } from "../middlewares/access-control";
import { customerSchema, customerUpdateSchema } from "../services/validation-schema";

const router = express.Router();

router.post("/api/customers", requireAuth, isGranted(userRoles.USER), body(customerSchema), addCustomer);
router.get("/api/customers", requireAuth, getCustomers);
router.get("/api/customers/:customerId", params({ customerId: Joi.string().uuid() }), requireAuth, customerSecurity, getCustomer);
router.put("/api/customers/:customerId", params({ customerId: Joi.string().uuid() }), requireAuth, isGranted(userRoles.USER) ,customerSecurity, body(customerUpdateSchema), updateCustomer);

router.delete("/api/customers/:customerId", params({ customerId: Joi.string().uuid() }), requireAuth, customerSecurity, deleteCustomer);

export { router as customerRouter };