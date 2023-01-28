import { NextFunction, Request, Response } from "express";
export declare const addCustomer: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export declare const getCustomers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getCustomer: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export declare const updateCustomer: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const deleteCustomer: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
