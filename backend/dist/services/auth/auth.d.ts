import { User } from "@prisma/client";
import { DecodedIdToken } from "firebase-admin/auth";
export declare const firebaseSignUp: (email: string, password: string) => Promise<import("firebase-admin/auth").UserRecord>;
export declare const firebaseUpdate: (currentUser: User & DecodedIdToken, email: string) => Promise<import("firebase-admin/auth").UserRecord>;
