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
exports.deleteInvoice = exports.updateInvoice = exports.getInvoice = exports.getInvoices = exports.addInvoice = void 0;
const client_1 = require("@prisma/client");
const not_found_error_1 = require("../errors/not-found-error");
const unprocessable_error_1 = require("../errors/unprocessable-error");
const prisma = new client_1.PrismaClient();
/*
{
  id: string;,
  amount: number;
  sent_at: string;
  status: string;
  chrono: number;
  customer_id: string;
  created_at: string;
  updated_at: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    company: string;
  },
  uid: string;
}
*/
// Exclude keys from invoice
function exclude(invoice, keys) {
    for (let key of keys) {
        delete invoice[key];
    }
    return invoice;
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // const user = await prisma.user.findUnique({ where: 1 })
        // const userWithoutPassword = exclude(user, ['password'])
    });
}
const excludeKeys = ["firstName", "lastName", "email", "company"];
function customizeInvoice(invoice) {
    const uid = invoice.id;
    const customer = {
        id: invoice.customer_id,
        firstName: invoice.firstName,
        lastName: invoice.lastName,
        email: invoice.email,
        company: invoice.company,
    };
    const invoiceWithoutKeys = exclude(invoice, [
        "firstName",
        "lastName",
        "email",
        "company",
    ]);
    return Object.assign(Object.assign({}, invoiceWithoutKeys), { customer, uid });
}
const addInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const invoice = Object.assign({}, req.body);
    try {
        let chrono = 0;
        try {
            // Get the next chrono invoice [{ chrono }]
            const result = yield prisma.$queryRaw `SELECT i.chrono FROM public."Invoice" i JOIN public."Customer" c ON c.id = i.customer_id JOIN public."User" u ON u.id = c.user_id  WHERE u.id = ${(_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.id} ORDER BY i.chrono DESC LIMIT 1`;
            // console.log(result[0].chrono);
            chrono = result[0].chrono || 0;
        }
        catch (error) {
            console.log(error);
        }
        chrono += 1;
        // console.log(chrono);
        // console.log(invoice);
        const invoiceCreated = yield prisma.invoice.create({
            data: Object.assign(Object.assign({}, invoice), { chrono }),
        });
        yield prisma.$disconnect();
        if (invoiceCreated) {
            console.log(invoiceCreated);
            return res.status(201).send(invoiceCreated);
        }
        next(new unprocessable_error_1.UnprocessableError("Invoice"));
    }
    catch (error) {
        // console.log(error);
        yield prisma.$disconnect();
        next(error);
    }
});
exports.addInvoice = addInvoice;
const getInvoices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const invoices_ = yield prisma.$queryRaw `SELECT i.*, c.first_name "firstName", c.last_name "lastName", c.email email, c.company company FROM public."Invoice" i JOIN public."Customer" c ON c.id = i.customer_id JOIN public."User" u ON u.id = c.user_id  WHERE u.id = ${(_b = req.currentUser) === null || _b === void 0 ? void 0 : _b.id} ORDER BY i.chrono ASC`;
        yield prisma.$disconnect();
        console.log("================= Invoices List =================");
        console.log(invoices_);
        const invoices = invoices_.map((invoice) => customizeInvoice(invoice));
        // console.log("================= Custom Invoices List =================");
        // console.log(invoices);
        res.json(invoices);
    }
    catch (error) {
        // console.log(error);
        yield prisma.$disconnect();
        next(error);
    }
});
exports.getInvoices = getInvoices;
const getInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.invoiceId;
    try {
        const invoice = yield prisma.invoice.findUnique({
            where: { id },
            include: { customer: true },
        });
        yield prisma.$disconnect();
        console.log(invoice);
        // If the invoice is found in the database
        if (invoice) {
            return res.json(Object.assign({}, invoice));
        }
        next(new not_found_error_1.NotFoundError("Invoice"));
    }
    catch (error) {
        //console.log(error);
        yield prisma.$disconnect();
        next(error);
    }
});
exports.getInvoice = getInvoice;
const updateInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.invoiceId;
    try {
        const updateInvoice = req.body;
        // Delete Invoice id property to avoid id changing id database
        delete updateInvoice.id;
        const updatedInvoice = yield prisma.invoice.update({
            where: { id },
            data: Object.assign({}, updateInvoice),
            include: { customer: true },
        });
        if (updatedInvoice) {
            return res.json(Object.assign({}, updatedInvoice));
        }
        yield prisma.$disconnect();
        return next(new not_found_error_1.NotFoundError("Invoice"));
    }
    catch (error) {
        //console.log(error);
        yield prisma.$disconnect();
        next(error);
    }
});
exports.updateInvoice = updateInvoice;
const deleteInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.invoiceId;
    // console.log(id);
    try {
        const deletedInvoice = yield prisma.invoice.delete({
            where: { id },
        });
        yield prisma.$disconnect();
        console.log(deletedInvoice);
        if (!deletedInvoice) {
            return next(new not_found_error_1.NotFoundError("Invoice"));
        }
        // 204
        return res.status(200).json({
            status: "Success",
            message: "Invoice deleted successfully",
        });
    }
    catch (error) {
        // console.log(error);
        yield prisma.$disconnect();
        next(error);
    }
});
exports.deleteInvoice = deleteInvoice;
//# sourceMappingURL=invoiceController.js.map