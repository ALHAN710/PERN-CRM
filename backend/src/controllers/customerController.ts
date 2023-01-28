import { Customer, Invoice, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/not-found-error";
import { UnprocessableError } from "../errors/unprocessable-error";

type TCustomCustomer = {
  id: string;
  invoices: Invoice[],
};

type WithCustomFields<T> = T & {
  id: number,
  uid: string,
  nbInvoices: number;
  totalAmount: number;
  unpaidAmount: number;
}

function customizeCustomer<Customer extends TCustomCustomer> (customer: Customer, id: number): WithCustomFields<Customer> {
  const nbInvoices = customer.invoices.length;
  const totalAmount = +customer.invoices.reduce((total, invoice) => total + invoice.amount, 0).toFixed(2) as number;
  const unpaidAmount = +customer.invoices.reduce((total, invoice) => {
    return total + (invoice.status === "PAID" || invoice.status === "CANCELLED" ? 0 : invoice.amount)
  }, 0).toFixed(2) as number;
  const uid = customer.id;
  
  return {...customer, nbInvoices, totalAmount, unpaidAmount, id, uid}
}

const prisma = new PrismaClient();

export const addCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = { ...req.body, userId: req.currentUser!.id };
  try {
    const customerCreated:
      | (Customer & {
          invoices: Invoice[];
        })
      | null = await prisma.customer.create({
      data: customer,
      include: { invoices: true },
    });

    await prisma.$disconnect();
    if (customerCreated) {
      console.log(customerCreated);
      return res.status(201).send(customerCreated);
    }

    next(new UnprocessableError("Customer"));
  } catch (error) {
    // console.log(error);
    await prisma.$disconnect();
    next(error);
  }
};

export const getCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customers = await prisma.customer.findMany({
      where: { userId: req.currentUser?.id },
      include: { invoices: true },
      orderBy: { createdAt: "asc" }
    });

    await prisma.$disconnect();
    const customers_ = customers.map((customer, index) => {
      return customizeCustomer(customer, index + 1);
    })
    console.log(customers_);
    res.json(customers_);
  } catch (error) {
    // console.log(error);
    await prisma.$disconnect();
    next(error);
  }
};

export const getCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.customerId;

  try {
    const customer = await prisma.customer.findFirst({
      where: { id, userId: req.currentUser?.id },
      include: { invoices: true },
    });

    await prisma.$disconnect();
    console.log(customer);

    // If the customer is found in the database
    if (customer) {
      // Change the nested relation to Uri
      const invoicesUri = customer.invoices.map((invoice) => {
        return `/api/invoices/${invoice.id}`;
      });
      const customer_: any = { ...customer };
      delete customer_.userId;
      return res.json({
        ...customer_,
        user: `/api/users/${customer.userId}`,
        invoices: invoicesUri,
      });
    }

    throw new NotFoundError("Customer");
    // next(new NotFoundError());
    /*res.status(404).json({
                status: 404,
                message: "Customer not found"
            });*/
  } catch (error) {
    //console.log(error);
    await prisma.$disconnect();
    next(error);
  }
};

export const updateCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.customerId;

  try {
    const updateCustomer = req.body;

    // Delete customer id property to avoid id changing id database
    delete updateCustomer.id;

    const updatedCustomerInfo = await prisma.customer.updateMany({
      where: { id, userId: req.currentUser?.id },
      data: { ...updateCustomer },
      // include: { invoices: true },
    });

    if (updatedCustomerInfo.count > 0) {
      const customer = await prisma.customer.findUnique({
        where: { id },
        include: { invoices: true },
      });

      if (customer) {
        // Change the nested relation to Uri
        const invoicesUri = customer.invoices.map((invoice) => {
          return `/api/invoices/${invoice.id}`;
        });

        return res.json({
          ...customer,
          userId: `/api/users/${customer.userId}`,
          invoices: invoicesUri,
        });
      }
    }

    await prisma.$disconnect();

    return next(new NotFoundError("Customer"));
  } catch (error) {
    //console.log(error);
    await prisma.$disconnect();
    next(error);
  }
};

export const deleteCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.customerId;

  try {
    const deletedCustomer = await prisma.customer.delete({
      where: { id },
    });

    await prisma.$disconnect();

    if (!deletedCustomer) {
      return next(new NotFoundError("Customer"));
    }
    // 204
    return res.status(200).json({
      status: "Success",
      message: "Customer deleted successfully",
    });
  } catch (error) {
    // console.log(error);
    await prisma.$disconnect();
    next(error);
  }
};
