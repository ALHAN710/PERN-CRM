import express from "express";
import { customerRouter } from "./customerRoutes";
import { invoiceRouter } from "./invoiceRoutes";
import { userRouter } from "./userRoutes";

const router = express.Router();

router.use(userRouter);
router.use(customerRouter);
router.use(invoiceRouter);

export default router;