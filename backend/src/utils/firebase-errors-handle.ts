import { NextFunction } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import { UnAuthenticatedError } from "../errors/unauthenticated-error";
import { UnprocessableError } from "../errors/unprocessable-error";

export interface IFirebaseError {
    code: string;
    message: string;
    codePrefix: string;
}

export function isIFirebaseError(object_: any): object_ is IFirebaseError {
    return "code" in object_ && "message" in object_ && "codePrefix" in object_;
}

export const firebaseErrorsHandle = ({code, codePrefix}: IFirebaseError, next: NextFunction, action = "create") => {
    console.log('======= Firebase Error Handler ========='); 
    switch (code) {
        case "auth/id-token-expired":
            console.log('======= auth/id-token-expired Error ========='); 
            next(new UnAuthenticatedError("The provided token is expired. Please try to reconnect."));
            break;
            
            case "auth/email-already-exists":
            console.log('======= auth/email-already-exists Error ========='); 
            next(new UnprocessableError("User", action));
            // next(new UnprocessableError("User", action, "Address Email already exists in the database."));
            break;
            
            case "auth/uid-already-exists":
            console.log('======= auth/uid-already-exists Error ========='); 
            next(new UnprocessableError("User", action));
            break;
    
        default:
            break;
    }
};