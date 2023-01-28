"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerRoutes_1 = require("./customerRoutes");
const invoiceRoutes_1 = require("./invoiceRoutes");
const userRoutes_1 = require("./userRoutes");
const router = express_1.default.Router();
router.use(userRoutes_1.userRouter);
router.use(customerRoutes_1.customerRouter);
router.use(invoiceRoutes_1.invoiceRouter);
exports.default = router;
//# sourceMappingURL=index.js.map