import { NextFunction, Request, Response } from "express";
export declare const addUser: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const getUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUser: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export declare const updateUser: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
