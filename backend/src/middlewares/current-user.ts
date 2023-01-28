import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { auth } from "../services/firebase";
import { firebaseErrorsHandle, isIFirebaseError } from "../utils/firebase-errors-handle";

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    const prisma = new PrismaClient();
    try {
      const firebaseUser = await auth.verifyIdToken(token);
      //req.currentUser = user;

      console.log("firebaseUser : ", firebaseUser);
      if (firebaseUser) {
        const prismaUser = await prisma.user.findUnique({
          where: { uid: firebaseUser.uid },
          include: {
            customers: {
              include: { invoices: true },
            },
          },
        });

        await prisma.$disconnect();

        if (prismaUser) {
          req.currentUser = { ...firebaseUser, ...prismaUser };
        } else req.currentUser = null;
      } else req.currentUser = null;
      console.log("Current user : ", req.currentUser);
      // console.log("Customers : ", req.currentUser?.customers);
      // console.log("Invoices : ", req.currentUser?.customers);
    } catch (error: any) {
      await prisma.$disconnect();

      console.log('======= Current User Error Exception =========');

      // Handle Firebase Error
      if(isIFirebaseError(error)) {
        firebaseErrorsHandle(error, next);

      } 
      next(error);
    }
  }
  return next();
};
