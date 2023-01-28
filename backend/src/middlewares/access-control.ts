import { Customer, PrismaClient } from "@prisma/client";
import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
import { NotAuthorizedError } from "../errors/forbidden-error";
import { NotFoundError } from "../errors/not-found-error";

const prisma = new PrismaClient();

export const security =
  (...securityHandlers: RequestHandler[]) =>
  (req: Request, res: Response, next: NextFunction) =>
    securityHandlers.forEach((handler) => handler(req, res, next));

export const isGranted = (role: userRoles) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("=========== Handler inside isGranted ============");
    const userRoles = req.currentUser?.roles;
    if (userRoles?.includes(role)) return next();
    return next(new NotAuthorizedError());
  };
};

export const userSecurity = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("============ User Security Handler =============");
  if (
    req.currentUser?.id === req.params.userId ||
    req.currentUser?.roles.includes(userRoles.ADMIN)
  ) {
    return next();
  }
  throw new NotAuthorizedError();
};

export const customerSecurity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("============ Customer Security Handler =============");

  const customer = await prisma.customer.findUnique({
    where: { id: req.params.customerId },
  });

  prisma.$disconnect();

  if (customer) {
    if (
      req.currentUser?.id === customer.userId ||
      req.currentUser?.roles.includes(userRoles.ADMIN)
    ) {
      return next();
    }
    return next(new NotAuthorizedError());
  }
  return next(new NotFoundError("Customer"));
};

export const invoiceSecurity = async (req: Request, res: Response, next: NextFunction) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id: req.params.invoiceId },
    include: { customer: {
      include: { user: true }
    }}
  });

  await prisma.$disconnect();
  // const { customerId } = req.body || { customerId: invoice?.customerId };
  const customerId = req.body.customerId ? req.body.customerId : invoice?.customerId;
  // console.log(customerId);
  const index = req.currentUser?.customers.findIndex( (customer: Customer) => customer.id === customerId);
  // console.log(index);
  if(invoice) {
    if (req.currentUser && (req.currentUser.id === invoice.customer.user.id) && (index! >= 0)) {
      return next();
    }
  }
  // console.log(invoice?.customer.user.id);
  return next(new NotAuthorizedError())
};


export enum role_hierarchy {
  ROLE_USER = "0",
  ROLE_INVOICER = "ROLE_USER",
  ROLE_ADMIN = "ROLE_INVOICER",
}

export enum userRoles {
  // ROLE_DEMO = "ROLE_DEMO",
  // ROLE_USER = "ROLE_USER",
  // ROLE_INVOICER = "ROLE_INVOICER",
  // ROLE_ADMIN = "ROLE_ADMIN",
  DEMO = "DEMO",
  USER = "USER",
  INVOICER = "INVOICER",
  ADMIN = "ADMIN",
}

const validate = (type: "owner" | "access") => {
  return (req: Request, res: Response, next: NextFunction) => {
    switch (type) {
      case "owner":
        const owner = req.params;
        break;

      default:
        break;
    }
  };
};
