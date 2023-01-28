import express, { Request } from "express";
import { addInvoice, deleteInvoice, getInvoice, getInvoices, updateInvoice } from "../controllers/invoiceController";
import { requireAuth } from "../middlewares/require-auth";
import { body, params } from "../middlewares/validate-request";
import Joi from "joi";
import { invoiceSecurity, isGranted, userRoles } from "../middlewares/access-control";
import { invoiceSchema, invoiceUpdateSchema } from "../services/validation-schema";

const router = express.Router();

router.post("/api/invoices", requireAuth, isGranted(userRoles.USER), body(invoiceSchema), addInvoice);
router.get("/api/invoices", requireAuth, getInvoices);
router.get("/api/invoices/:invoiceId", params({ invoiceId: Joi.string().uuid() }), requireAuth, invoiceSecurity, getInvoice);
router.put("/api/invoices/:invoiceId", params({ invoiceId: Joi.string().uuid() }), requireAuth, isGranted(userRoles.USER), invoiceSecurity, body(invoiceUpdateSchema), updateInvoice);

router.delete("/api/invoices/:invoiceId", params({ invoiceId: Joi.string().uuid() }), requireAuth, invoiceSecurity, deleteInvoice);

export { router as invoiceRouter };