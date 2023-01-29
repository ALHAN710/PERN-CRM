import { User, UserCredential } from "firebase/auth";
import React from "react";

export type FormData = {
  email: string;
  password: string;
}; 

export type TCredentials = {
  email: string;
  password: string;
}

export type IUserContext = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}
