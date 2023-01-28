"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceRouter = void 0;
const express_1 = __importDefault(require("express"));
const invoiceController_1 = require("../controllers/invoiceController");
const require_auth_1 = require("../middlewares/require-auth");
const validate_request_1 = require("../middlewares/validate-request");
const joi_1 = __importDefault(require("joi"));
const access_control_1 = require("../middlewares/access-control");
const validation_schema_1 = require("../services/validation-schema");
const router = express_1.default.Router();
exports.invoiceRouter = router;
router.post("/api/invoices", require_auth_1.requireAuth, (0, access_control_1.isGranted)(access_control_1.userRoles.USER), (0, validate_request_1.body)(validation_schema_1.invoiceSchema), invoiceController_1.addInvoice);
router.get("/api/invoices", require_auth_1.requireAuth, invoiceController_1.getInvoices);
router.get("/api/invoices/:invoiceId", (0, validate_request_1.params)({ invoiceId: joi_1.default.string().uuid() }), require_auth_1.requireAuth, access_control_1.invoiceSecurity, invoiceController_1.getInvoice);
router.put("/api/invoices/:invoiceId", (0, validate_request_1.params)({ invoiceId: joi_1.default.string().uuid() }), require_auth_1.requireAuth, (0, access_control_1.isGranted)(access_control_1.userRoles.USER), access_control_1.invoiceSecurity, (0, validate_request_1.body)(validation_schema_1.invoiceUpdateSchema), invoiceController_1.updateInvoice);
router.delete("/api/invoices/:invoiceId", (0, validate_request_1.params)({ invoiceId: joi_1.default.string().uuid() }), require_auth_1.requireAuth, access_control_1.invoiceSecurity, invoiceController_1.deleteInvoice);
//# sourceMappingURL=invoiceRoutes.js.map