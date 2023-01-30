import express from "express";
import Joi from "joi";
import { addInvoice, deleteInvoice, getInvoice, getInvoices, updateInvoice } from "../controllers/invoiceController";
import { invoiceSecurity, isGranted, userRoles } from "../middlewares/access-control";
import { requireAuth } from "../middlewares/require-auth";
import { body, params } from "../middlewares/validate-request";
import { invoiceSchema, invoiceUpdateSchema } from "../services/validation-schema";

const router = express.Router();

router.post("/api/invoices", requireAuth, isGranted(userRoles.USER), body(invoiceSchema), addInvoice);
router.get("/api/invoices", requireAuth, getInvoices);
router.get("/api/invoices/:invoiceId", params({ invoiceId: Joi.string().uuid() }), requireAuth, isGranted(userRoles.USER), invoiceSecurity, getInvoice);
router.put("/api/invoices/:invoiceId", params({ invoiceId: Joi.string().uuid() }), requireAuth, isGranted(userRoles.USER), invoiceSecurity, body(invoiceUpdateSchema), updateInvoice);

router.delete("/api/invoices/:invoiceId", params({ invoiceId: Joi.string().uuid() }), requireAuth, isGranted(userRoles.USER), invoiceSecurity, deleteInvoice);

export { router as invoiceRouter };
