import { IdTokenResult } from "firebase/auth";
// import jwtDecode from "jwt-decode";
import { useContext } from "react";
import { ContextAPI } from "../../context/ContextAPI";
import { firebaseSignOut } from "./firebase-auth";
import { auth } from "./firebase-config";

type Token = {
  exp: number;
  firstName: string;
  iat: number;
  lastName: string;
  roles: string[];
  username: string;
};

/**
 * Check if the user is authenticated
 * @returns boolean
 */
export const checkIsAuthenticated = (): boolean => {
  const exp = window.localStorage.getItem("authExp");
  // console.log("Current User Email :", auth.currentUser?.email);
  // const btn = document.querySelector('.btnLogOut');
  // console.log(btn);
  // console.log("authExp", exp);
  let isAuthenticated = false;
  if (exp) {
    // return true;
    // let { exp: expiration } = jwtDecode<Token>(token); // expiration time in seconds
    // let { exp } = token?.claims;
    let expiration: number = parseInt(exp) * 1000; // convert expiration time to milliseconds
    const nowTime = new Date().getTime(); //now time in milliseconds
    if (expiration > nowTime) {
      // return true;
      isAuthenticated = true;
    }
    // return false;
  }
  // return false;
  if(!isAuthenticated) {
    // TODO: firebase signout
    firebaseSignOut()
      .then(() => console.log("FireBase successfully sign out!"))
      .catch(console.log);
    // await firebaseSignOut();
  }
  return isAuthenticated;
};
