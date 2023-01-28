import { Customer, Invoice, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/not-found-error";
import { UnprocessableError } from "../errors/unprocessable-error";

const prisma = new PrismaClient();

type TCustomInvoice = {
  id: string;
  customer_id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
};
type TExcludeKeys = "firstName" | "lastName" | "email" | "company";

type WithCustomFields<T> = Omit<T, TExcludeKeys> & {
  uid: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    company: string;
  };
};
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
function exclude<Invoice, Key extends keyof Invoice>(
  invoice: Invoice,
  keys: Key[]
): Omit<Invoice, Key> {
  for (let key of keys) {
    delete invoice[key];
  }
  return invoice;
}

async function main() {
  // const user = await prisma.user.findUnique({ where: 1 })
  // const userWithoutPassword = exclude(user, ['password'])
}

const excludeKeys = ["firstName", "lastName", "email", "company"];

function customizeInvoice<Invoice extends TCustomInvoice>(
  invoice: Invoice
): WithCustomFields<Invoice> {
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

  return { ...invoiceWithoutKeys, customer, uid };
}

export const addInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const invoice = { ...req.body };
  try {
    let chrono = 0;
    try {
      // Get the next chrono invoice [{ chrono }]
      const result = await prisma.$queryRaw<
        { chrono: number | undefined }[]
      >`SELECT i.chrono FROM public."Invoice" i JOIN public."Customer" c ON c.id = i.customer_id JOIN public."User" u ON u.id = c.user_id  WHERE u.id = ${req.currentUser?.id} ORDER BY i.chrono DESC LIMIT 1`;
      // console.log(result[0].chrono);
      chrono = result[0].chrono || 0;
    } catch (error) {
      console.log(error);
    }

    
    chrono += 1;
    // console.log(chrono);
    // console.log(invoice);
    const invoiceCreated = await prisma.invoice.create({
      data: { ...invoice, chrono },
    });

    await prisma.$disconnect();
    if (invoiceCreated) {
      console.log(invoiceCreated);
      return res.status(201).send(invoiceCreated);
    }

    next(new UnprocessableError("Invoice"));
  } catch (error) {
    // console.log(error);
    await prisma.$disconnect();
    next(error);
  }
};

export const getInvoices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const invoices_: any =
      await prisma.$queryRaw`SELECT i.*, c.first_name "firstName", c.last_name "lastName", c.email email, c.company company FROM public."Invoice" i JOIN public."Customer" c ON c.id = i.customer_id JOIN public."User" u ON u.id = c.user_id  WHERE u.id = ${req.currentUser?.id} ORDER BY i.chrono ASC`;

    await prisma.$disconnect();
    console.log("================= Invoices List =================");
    console.log(invoices_);
    const invoices = invoices_.map((invoice: any) => customizeInvoice(invoice));
    // console.log("================= Custom Invoices List =================");
    // console.log(invoices);
    res.json(invoices);
  } catch (error) {
    // console.log(error);
    await prisma.$disconnect();
    next(error);
  }
};

export const getInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.invoiceId;

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { customer: true },
    });

    await prisma.$disconnect();
    console.log(invoice);

    // If the invoice is found in the database
    if (invoice) {
      return res.json({
        ...invoice,
      });
    }

    next(new NotFoundError("Invoice"));
  } catch (error) {
    //console.log(error);
    await prisma.$disconnect();
    next(error);
  }
};

export const updateInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.invoiceId;

  try {
    const updateInvoice = req.body;

    // Delete Invoice id property to avoid id changing id database
    delete updateInvoice.id;

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: { ...updateInvoice },
      include: { customer: true },
    });

    if (updatedInvoice) {
      return res.json({
        ...updatedInvoice,
      });
    }

    await prisma.$disconnect();

    return next(new NotFoundError("Invoice"));
  } catch (error) {
    //console.log(error);
    await prisma.$disconnect();
    next(error);
  }
};

export const deleteInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.invoiceId;
  // console.log(id);
  try {
    const deletedInvoice = await prisma.invoice.delete({
      where: { id },
    });

    await prisma.$disconnect();
    console.log(deletedInvoice);
    if (!deletedInvoice) {
      return next(new NotFoundError("Invoice"));
    }
    // 204
    return res.status(200).json({
      status: "Success",
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    // console.log(error);
    await prisma.$disconnect();
    next(error);
  }
};
