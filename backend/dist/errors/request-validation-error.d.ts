import { CustomError } from "./custom-error";
export interface IValidationError {
    message: string;
    field: string;
}
export declare class RequestValidationError extends CustomError {
    errors: IValidationError[];
    statusCode: number;
    constructor(errors: IValidationError[]);
    serializeErrors(): IValidationError[];
}
