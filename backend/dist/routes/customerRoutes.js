"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRouter = void 0;
const express_1 = __importDefault(require("express"));
const customerController_1 = require("../controllers/customerController");
const require_auth_1 = require("../middlewares/require-auth");
const validate_request_1 = require("../middlewares/validate-request");
const joi_1 = __importDefault(require("joi"));
const access_control_1 = require("../middlewares/access-control");
const validation_schema_1 = require("../services/validation-schema");
const router = express_1.default.Router();
exports.customerRouter = router;
router.post("/api/customers", require_auth_1.requireAuth, (0, access_control_1.isGranted)(access_control_1.userRoles.USER), (0, validate_request_1.body)(validation_schema_1.customerSchema), customerController_1.addCustomer);
router.get("/api/customers", require_auth_1.requireAuth, customerController_1.getCustomers);
router.get("/api/customers/:customerId", (0, validate_request_1.params)({ customerId: joi_1.default.string().uuid() }), require_auth_1.requireAuth, access_control_1.customerSecurity, customerController_1.getCustomer);
router.put("/api/customers/:customerId", (0, validate_request_1.params)({ customerId: joi_1.default.string().uuid() }), require_auth_1.requireAuth, (0, access_control_1.isGranted)(access_control_1.userRoles.USER), access_control_1.customerSecurity, (0, validate_request_1.body)(validation_schema_1.customerUpdateSchema), customerController_1.updateCustomer);
router.delete("/api/customers/:customerId", (0, validate_request_1.params)({ customerId: joi_1.default.string().uuid() }), require_auth_1.requireAuth, access_control_1.customerSecurity, customerController_1.deleteCustomer);
//# sourceMappingURL=customerRoutes.js.map