import { NextFunction } from "express";
export interface IFirebaseError {
    code: string;
    message: string;
    codePrefix: string;
}
export declare function isIFirebaseError(object_: any): object_ is IFirebaseError;
export declare const firebaseErrorsHandle: ({ code, codePrefix }: IFirebaseError, next: NextFunction, action?: string) => void;
