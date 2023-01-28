import { DecodedIdToken } from "firebase-admin/auth";
import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      // currentUser?: DecodedIdToken;
      currentUser?:
        | ((User & {
            customers: (Customer & {
              invoices: Invoice[];
            })[];
          }) &
            DecodedIdToken)
        | null; //DecodedIdToken;
    }
  }
}
