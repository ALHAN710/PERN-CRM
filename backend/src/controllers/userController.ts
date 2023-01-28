import { Customer, PrismaClient, User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/not-found-error";
import { firebaseSignUp, firebaseUpdate } from "../services/auth/auth";
import { auth } from "../services/firebase";
import {
  firebaseErrorsHandle,
  isIFirebaseError,
} from "../utils/firebase-errors-handle";

const prisma = new PrismaClient();

export const addUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //
  try {
    const { email, password, firstName, lastName, roles } = req.body;
    const userRecord = await firebaseSignUp(email, password);
    const roles_ = roles || ["USER"];
    if (userRecord) {
      if (roles_ && roles_.includes("USER")) roles_.push("USER");

      const user: any = {
        // id: userRecord.uid,
        uid: userRecord.uid,
        // email: faker.internet.email(firstName_, lastName_),
        // email,
        firstName,
        lastName,
        roles: roles_,
        //   roles: req.body.userRoles.push("USER"),
      };

      const userCreated = await prisma.user.create({
        data: {
          ...user,
        },
      });

      await prisma.$disconnect();
      if (userCreated) {
        console.log(userCreated);
        return res.status(201).json(userCreated);
      }

      return next(new Error("Can't create User"));
    }
  } catch (error: any) {
    await prisma.$disconnect();
    console.log("======= Create User Error Exception =========");
    console.log(error);

    // Handle Firebase Error
    if (isIFirebaseError(error)) {
      firebaseErrorsHandle(error, next);
    }
    // throw new Error(error);
    
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany({
      include: { customers: true}
    });

    await prisma.$disconnect();
    console.table(users);
    let users_: (object & {
      customers: string[];
  })[] = [];
    users.map((user, _, users) => {
      const customers = user.customers.map((customer) => {
        return `/api/customers/${customer.id}`;
      });
      const index = users.findIndex(value => value.id === user.id);
      const user_ = {...user };
      // const user_ = { id: user.id, uid: user.uid, firstName: user.firstName, lastName: user.lastName, roles: user.roles };
      

      users_[index] = {...user_, customers };
    });

    res.json(users_);
  } catch (error) {
    // console.log(error);
    await prisma.$disconnect();
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.userId;

  try {
    const user:
      | (User & {
          customers: Customer[];
        })
      | null = await prisma.user.findUnique({
      where: { id },
      include: { customers: true },
    });

    await prisma.$disconnect();
    console.log(user);

    // If the user is found in the database
    if (user) {
      const user_: any = { ...user };
      delete user_.updatedAt;
      // Change the nested relation to Uri
      const customersUri = user.customers.map((customer) => {
        return `/api/customers/${customer.id}`;
      });

      return res.json({
        ...user_,
        customers: customersUri,
      });
    }

    throw new NotFoundError("User");
  } catch (error) {
    //console.log(error);
    await prisma.$disconnect();
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {userId: id} = req.params;

  try {
    const updateUser = req.body;
    const { email } = req.body;

    // Update Firebase User email
    // const updatedFirebaseUser = await firebaseUpdate(req.currentUser!, email);

    // if (updatedFirebaseUser) {

      // Delete user id property to avoid id changing id database
      delete updateUser.id;
      console.log(updateUser);
      const user = await prisma.user.update({
        where: { id },
        data: { ...updateUser },
        include: { customers: true },
      });

      await prisma.$disconnect();

      if (user) {
        // Change the nested relation to Uri
        const customersUri = user.customers.map((customer) => {
          return `/api/customers/${customer.id}`;
        });

        return res.json({
          ...user,
          customers: customersUri,
        });
      }

      throw new NotFoundError("User");
    // }
  } catch (error: any) {
    await prisma.$disconnect();
    console.log("======= Update User Error Exception =========");
    if(error instanceof PrismaClientKnownRequestError) {
      console.log(error.meta);
      // throw new NotFoundError("User");
      return next(new NotFoundError("User"));
    }
 
    // Handle Firebase Error
    if (isIFirebaseError(error)) {
      firebaseErrorsHandle(error, next, "update"); 
    }

    if(error instanceof NotFoundError) throw new NotFoundError("User");
    throw new Error(error);

  }
};
