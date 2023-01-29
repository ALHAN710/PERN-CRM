
export interface I_Invoice {
    amount: number;
    status: ("SENT" | "PAID" | "CANCELLED");
    customerId: string;
}