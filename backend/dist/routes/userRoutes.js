"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const userController_1 = require("../controllers/userController");
const access_control_1 = require("../middlewares/access-control");
const require_auth_1 = require("../middlewares/require-auth");
const validate_request_1 = require("../middlewares/validate-request");
const validation_schema_1 = require("../services/validation-schema");
const router = express_1.default.Router();
exports.userRouter = router;
router.post("/api/users/signup", (0, validate_request_1.body)(validation_schema_1.registerSchema), userController_1.addUser);
router.get("/api/users", require_auth_1.requireAuth, (0, access_control_1.isGranted)(access_control_1.userRoles.ADMIN), userController_1.getUsers);
router.get("/api/users/:userId", (0, validate_request_1.params)({ userId: joi_1.default.string().uuid() }), require_auth_1.requireAuth, access_control_1.userSecurity, userController_1.getUser);
router.put("/api/users/account/:userId", require_auth_1.requireAuth, (0, validate_request_1.params)({ userId: joi_1.default.string().uuid() }), (0, access_control_1.security)(
// isGranted(userRoles.USER),
access_control_1.userSecurity), (0, validate_request_1.body)(validation_schema_1.accountSchema), userController_1.updateUser);
//# sourceMappingURL=userRoutes.js.map