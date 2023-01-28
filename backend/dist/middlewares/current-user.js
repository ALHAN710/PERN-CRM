"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUser = void 0;
const client_1 = require("@prisma/client");
const firebase_1 = require("../services/firebase");
const firebase_errors_handle_1 = require("../utils/firebase-errors-handle");
const currentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const prisma = new client_1.PrismaClient();
        try {
            const firebaseUser = yield firebase_1.auth.verifyIdToken(token);
            //req.currentUser = user;
            console.log("firebaseUser : ", firebaseUser);
            if (firebaseUser) {
                const prismaUser = yield prisma.user.findUnique({
                    where: { uid: firebaseUser.uid },
                    include: {
                        customers: {
                            include: { invoices: true },
                        },
                    },
                });
                yield prisma.$disconnect();
                if (prismaUser) {
                    req.currentUser = Object.assign(Object.assign({}, firebaseUser), prismaUser);
                }
                else
                    req.currentUser = null;
            }
            else
                req.currentUser = null;
            console.log("Current user : ", req.currentUser);
            // console.log("Customers : ", req.currentUser?.customers);
            // console.log("Invoices : ", req.currentUser?.customers);
        }
        catch (error) {
            yield prisma.$disconnect();
            console.log('======= Current User Error Exception =========');
            // Handle Firebase Error
            if ((0, firebase_errors_handle_1.isIFirebaseError)(error)) {
                (0, firebase_errors_handle_1.firebaseErrorsHandle)(error, next);
            }
            next(error);
        }
    }
    return next();
});
exports.currentUser = currentUser;
//# sourceMappingURL=current-user.js.map