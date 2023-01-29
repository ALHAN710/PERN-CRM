import { ErrorOption } from "react-hook-form";
import { UseFormSetError } from "react-hook-form/dist/types";
import { TErrorAPI } from "../../types/utils";

type errorType = {
    status: number;
    message: string | any;
    type: string;
}

export const setFormErrors = (errors: TErrorAPI[], setFieldError?: UseFormSetError<any>) => {
    errors.forEach((error) => {
        const message = error.message.replaceAll("\"", "");
        // console.log(message);
        if(error.field) {
            setFieldError && setFieldError(error.field, {
                type: "manual",
                message,
            });
        }
    });
    /*switch (error.type) {
        case "create":
            if (error.status !== 201) {
                if (error.message && typeof error.message !== "string") {
                    
                    error.message.forEach((violation: any) => {
                        setFieldError && setFieldError(violation.propertyPath, {
                            type: "manual",
                            message: violation.message,
                        });
                    });
                }
            }
            
            break;
    
        case "update":
            if (error.status !== 201) {
                if (error.message && typeof error.message !== "string") {
                    
                    error.message.forEach((violation: any) => {
                        setFieldError && setFieldError(violation.propertyPath, {
                            type: "manual",
                            message: violation.message,
                        });
                    });
                }
            }
            
            break;
    
        default:
            break;
    }*/
}

