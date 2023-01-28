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
exports.deleteCustomer = exports.updateCustomer = exports.getCustomer = exports.getCustomers = exports.addCustomer = void 0;
const client_1 = require("@prisma/client");
const not_found_error_1 = require("../errors/not-found-error");
const unprocessable_error_1 = require("../errors/unprocessable-error");
function customizeCustomer(customer, id) {
    const nbInvoices = customer.invoices.length;
    const totalAmount = +customer.invoices.reduce((total, invoice) => total + invoice.amount, 0).toFixed(2);
    const unpaidAmount = +customer.invoices.reduce((total, invoice) => {
        return total + (invoice.status === "PAID" || invoice.status === "CANCELLED" ? 0 : invoice.amount);
    }, 0).toFixed(2);
    const uid = customer.id;
    return Object.assign(Object.assign({}, customer), { nbInvoices, totalAmount, unpaidAmount, id, uid });
}
const prisma = new client_1.PrismaClient();
const addCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = Object.assign(Object.assign({}, req.body), { userId: req.currentUser.id });
    try {
        const customerCreated = yield prisma.customer.create({
            data: customer,
            include: { invoices: true },
        });
        yield prisma.$disconnect();
        if (customerCreated) {
            console.log(customerCreated);
            return res.status(201).send(customerCreated);
        }
        next(new unprocessable_error_1.UnprocessableError("Customer"));
    }
    catch (error) {
        // console.log(error);
        yield prisma.$disconnect();
        next(error);
    }
});
exports.addCustomer = addCustomer;
const getCustomers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const customers = yield prisma.customer.findMany({
            where: { userId: (_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.id },
            include: { invoices: true },
            orderBy: { createdAt: "asc" }
        });
        yield prisma.$disconnect();
        const customers_ = customers.map((customer, index) => {
            return customizeCustomer(customer, index + 1);
        });
        console.log(customers_);
        res.json(customers_);
    }
    catch (error) {
        // console.log(error);
        yield prisma.$disconnect();
        next(error);
    }
});
exports.getCustomers = getCustomers;
const getCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const id = req.params.customerId;
    try {
        const customer = yield prisma.customer.findFirst({
            where: { id, userId: (_b = req.currentUser) === null || _b === void 0 ? void 0 : _b.id },
            include: { invoices: true },
        });
        yield prisma.$disconnect();
        console.log(customer);
        // If the customer is found in the database
        if (customer) {
            // Change the nested relation to Uri
            const invoicesUri = customer.invoices.map((invoice) => {
                return `/api/invoices/${invoice.id}`;
            });
            const customer_ = Object.assign({}, customer);
            delete customer_.userId;
            return res.json(Object.assign(Object.assign({}, customer_), { user: `/api/users/${customer.userId}`, invoices: invoicesUri }));
        }
        throw new not_found_error_1.NotFoundError("Customer");
        // next(new NotFoundError());
        /*res.status(404).json({
                    status: 404,
                    message: "Customer not found"
                });*/
    }
    catch (error) {
        //console.log(error);
        yield prisma.$disconnect();
        next(error);
    }
});
exports.getCustomer = getCustomer;
const updateCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const id = req.params.customerId;
    try {
        const updateCustomer = req.body;
        // Delete customer id property to avoid id changing id database
        delete updateCustomer.id;
        const updatedCustomerInfo = yield prisma.customer.updateMany({
            where: { id, userId: (_c = req.currentUser) === null || _c === void 0 ? void 0 : _c.id },
            data: Object.assign({}, updateCustomer),
            // include: { invoices: true },
        });
        if (updatedCustomerInfo.count > 0) {
            const customer = yield prisma.customer.findUnique({
                where: { id },
                include: { invoices: true },
            });
            if (customer) {
                // Change the nested relation to Uri
                const invoicesUri = customer.invoices.map((invoice) => {
                    return `/api/invoices/${invoice.id}`;
                });
                return res.json(Object.assign(Object.assign({}, customer), { userId: `/api/users/${customer.userId}`, invoices: invoicesUri }));
            }
        }
        yield prisma.$disconnect();
        return next(new not_found_error_1.NotFoundError("Customer"));
    }
    catch (error) {
        //console.log(error);
        yield prisma.$disconnect();
        next(error);
    }
});
exports.updateCustomer = updateCustomer;
const deleteCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.customerId;
    try {
        const deletedCustomer = yield prisma.customer.delete({
            where: { id },
        });
        yield prisma.$disconnect();
        if (!deletedCustomer) {
            return next(new not_found_error_1.NotFoundError("Customer"));
        }
        // 204
        return res.status(200).json({
            status: "Success",
            message: "Customer deleted successfully",
        });
    }
    catch (error) {
        // console.log(error);
        yield prisma.$disconnect();
        next(error);
    }
});
exports.deleteCustomer = deleteCustomer;
//# sourceMappingURL=customerController.js.map