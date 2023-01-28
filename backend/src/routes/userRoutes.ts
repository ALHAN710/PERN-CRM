import express from "express";
import Joi from "joi";
import {
  addUser,
  getUser,
  getUsers,
  updateUser
} from "../controllers/userController";
import {
  isGranted,
  security,
  userRoles,
  userSecurity
} from "../middlewares/access-control";
import { requireAuth } from "../middlewares/require-auth";
import { body, params } from "../middlewares/validate-request";
import { accountSchema, registerSchema } from "../services/validation-schema";

const router = express.Router();

router.post("/api/users/signup", body(registerSchema), addUser);
router.get("/api/users", requireAuth, isGranted(userRoles.ADMIN), getUsers);
router.get(
  "/api/users/:userId",
  params({ userId: Joi.string().uuid() }),
  requireAuth,
  userSecurity,
  getUser
);
router.put(
  "/api/users/account/:userId",
  requireAuth,
  params({ userId: Joi.string().uuid() }),
  security(
    // isGranted(userRoles.USER),
    userSecurity
  ),
  body(accountSchema),
  updateUser
);

export { router as userRouter };

