import { NextFunction, Request, Response } from "express";
export declare const addInvoice: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export declare const getInvoices: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getInvoice: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export declare const updateInvoice: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const deleteInvoice: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
