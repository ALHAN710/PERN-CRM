import { CustomError } from "./custom-error";
export declare class UnprocessableError extends CustomError {
    resource?: string;
    action: string;
    mess?: string;
    statusCode: number;
    constructor(resource?: string, action?: string, mess?: string);
    serializeErrors(): {
        message: string;
    }[];
}
