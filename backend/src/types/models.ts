
export enum E_INVOICE_STATUS {
  SENT = "SENT",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

export interface I_Invoice {
  id?         : string; 
  amount      : number; 
  sentAt      : string; 
  status      : E_INVOICE_STATUS;  
  chrono?     : number; 
  customerId? : string; 
}

export interface I_Customer {
  id?        : string; 
  createdAt? : string; 
  updatedAt? : string; 
  firstName  : string; 
  lastName   : string; 
  email      : string; 
  company?   : string; 
  userId?    : string; 
  invoices?  : I_Invoice[]; 
}

export interface I_User {
    id?        : string; 
    createdAt? : string; 
    updatedAt? : string; 
    email      : string; 
    password?  : string; 
    firstName  : string; 
    lastName   : string; 
    roles?     : Array<"USER" | "ADMIN" | "INVOICER">; 
    customers? : I_Customer[]; 
}