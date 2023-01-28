import { User } from "@prisma/client";
import { FirebaseError } from "firebase-admin";
import { UnprocessableError } from "../../errors/unprocessable-error";
import { auth } from "../firebase";
import { DecodedIdToken } from "firebase-admin/auth";
import { firebaseErrorsHandle, isIFirebaseError } from "../../utils/firebase-errors-handle";
import { NextFunction } from "express";

export const firebaseSignUp = async (email: string, password: string, ) => {
  const userRecord = await auth.createUser({
    //uid: "some-uid",
    email,
    password,
    //phoneNumber: "+11234567890",
    disabled: true,
  });
  return userRecord;

  /*try {
  } catch (error: any) {
    // const error_ = error as FirebaseError;
    console.log("============ Firebase SignUp Error ============");
    // console.log(error);
    // console.log("Code", error.code);
    // console.log("Message", error.message);
    throw new Error(error);
    
    //next(new UnprocessableError("User"));
  }*/
};

export const firebaseUpdate = async (currentUser: User & DecodedIdToken, email: string) => {
  
  const userUpdated = await auth.updateUser( currentUser.uid, {
    email
  });
  return userUpdated;

  /*try {
    
  } catch (error: any) {
    
    // const error_ = error as FirebaseError;
    console.log("============ Firebase Update User Error ============");
    throw new Error(error);
    // console.log(error);
    // console.log("Code", error_.code);
    // console.log("Message", error_.message);
      
    // throw new UnprocessableError("User", "create");
  }
  */
  
};
