import express from "express";
import path from "path";
import { customerRouter } from "./customerRoutes";
import { invoiceRouter } from "./invoiceRoutes";
import { userRouter } from "./userRoutes";

const router = express.Router();

router.use(userRouter);
router.use(customerRouter);
router.use(invoiceRouter);

router.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../../client/dist/index.html"))
})

export default router;