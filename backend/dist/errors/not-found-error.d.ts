import { CustomError } from "./custom-error";
export declare class NotFoundError extends CustomError {
    resource?: string;
    statusCode: number;
    constructor(resource?: string);
    serializeErrors(): {
        message: string;
    }[];
}
