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
exports.updateUser = exports.getUser = exports.getUsers = exports.addUser = void 0;
const client_1 = require("@prisma/client");
const runtime_1 = require("@prisma/client/runtime");
const not_found_error_1 = require("../errors/not-found-error");
const auth_1 = require("../services/auth/auth");
const firebase_errors_handle_1 = require("../utils/firebase-errors-handle");
const prisma = new client_1.PrismaClient();
const addUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //
    try {
        const { email, password, firstName, lastName, roles } = req.body;
        const userRecord = yield (0, auth_1.firebaseSignUp)(email, password);
        const roles_ = roles || ["USER"];
        if (userRecord) {
            if (roles_ && roles_.includes("USER"))
                roles_.push("USER");
            const user = {
                // id: userRecord.uid,
                uid: userRecord.uid,
                // email: faker.internet.email(firstName_, lastName_),
                // email,
                firstName,
                lastName,
                roles: roles_,
                //   roles: req.body.userRoles.push("USER"),
            };
            const userCreated = yield prisma.user.create({
                data: Object.assign({}, user),
            });
            yield prisma.$disconnect();
            if (userCreated) {
                console.log(userCreated);
                return res.status(201).json(userCreated);
            }
            return next(new Error("Can't create User"));
        }
    }
    catch (error) {
        yield prisma.$disconnect();
        console.log("======= Create User Error Exception =========");
        console.log(error);
        // Handle Firebase Error
        if ((0, firebase_errors_handle_1.isIFirebaseError)(error)) {
            (0, firebase_errors_handle_1.firebaseErrorsHandle)(error, next);
        }
        // throw new Error(error);
        next(error);
    }
});
exports.addUser = addUser;
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
            include: { customers: true }
        });
        yield prisma.$disconnect();
        console.table(users);
        let users_ = [];
        users.map((user, _, users) => {
            const customers = user.customers.map((customer) => {
                return `/api/customers/${customer.id}`;
            });
            const index = users.findIndex(value => value.id === user.id);
            const user_ = Object.assign({}, user);
            // const user_ = { id: user.id, uid: user.uid, firstName: user.firstName, lastName: user.lastName, roles: user.roles };
            users_[index] = Object.assign(Object.assign({}, user_), { customers });
        });
        res.json(users_);
    }
    catch (error) {
        // console.log(error);
        yield prisma.$disconnect();
        next(error);
    }
});
exports.getUsers = getUsers;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.userId;
    try {
        const user = yield prisma.user.findUnique({
            where: { id },
            include: { customers: true },
        });
        yield prisma.$disconnect();
        console.log(user);
        // If the user is found in the database
        if (user) {
            const user_ = Object.assign({}, user);
            delete user_.updatedAt;
            // Change the nested relation to Uri
            const customersUri = user.customers.map((customer) => {
                return `/api/customers/${customer.id}`;
            });
            return res.json(Object.assign(Object.assign({}, user_), { customers: customersUri }));
        }
        throw new not_found_error_1.NotFoundError("User");
    }
    catch (error) {
        //console.log(error);
        yield prisma.$disconnect();
        next(error);
    }
});
exports.getUser = getUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId: id } = req.params;
    try {
        const updateUser = req.body;
        const { email } = req.body;
        // Update Firebase User email
        // const updatedFirebaseUser = await firebaseUpdate(req.currentUser!, email);
        // if (updatedFirebaseUser) {
        // Delete user id property to avoid id changing id database
        delete updateUser.id;
        console.log(updateUser);
        const user = yield prisma.user.update({
            where: { id },
            data: Object.assign({}, updateUser),
            include: { customers: true },
        });
        yield prisma.$disconnect();
        if (user) {
            // Change the nested relation to Uri
            const customersUri = user.customers.map((customer) => {
                return `/api/customers/${customer.id}`;
            });
            return res.json(Object.assign(Object.assign({}, user), { customers: customersUri }));
        }
        throw new not_found_error_1.NotFoundError("User");
        // }
    }
    catch (error) {
        yield prisma.$disconnect();
        console.log("======= Update User Error Exception =========");
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            console.log(error.meta);
            // throw new NotFoundError("User");
            return next(new not_found_error_1.NotFoundError("User"));
        }
        // Handle Firebase Error
        if ((0, firebase_errors_handle_1.isIFirebaseError)(error)) {
            (0, firebase_errors_handle_1.firebaseErrorsHandle)(error, next, "update");
        }
        if (error instanceof not_found_error_1.NotFoundError)
            throw new not_found_error_1.NotFoundError("User");
        throw new Error(error);
    }
});
exports.updateUser = updateUser;
//# sourceMappingURL=userController.js.map