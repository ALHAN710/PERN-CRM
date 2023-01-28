import { NextFunction, Request, Response } from "express";
import { AnySchema } from "joi";
export declare const body: (schema: AnySchema | Record<string, AnySchema>) => (req: Request, res: Response, next: NextFunction) => void;
export declare const query: (schema: AnySchema | Record<string, AnySchema>) => (req: Request, res: Response, next: NextFunction) => void;
export declare const params: (schema: AnySchema | Record<string, AnySchema>) => (req: Request, res: Response, next: NextFunction) => void;
