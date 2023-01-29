export interface ICustomer {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
}

export type TCustomer = {
  id?: number;
  uid?: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  company?: string;
  invoices?: string[];
  nbInvoices?: number;
  user?: string;
  totalAmount?: number;
  unpaidAmount?: number;
};
