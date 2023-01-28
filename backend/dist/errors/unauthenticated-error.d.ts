import { CustomError } from "./custom-error";
export declare class UnAuthenticatedError extends CustomError {
    mess?: string;
    statusCode: number;
    constructor(mess?: string);
    serializeErrors(): {
        message: string;
        status: number;
    }[];
}
