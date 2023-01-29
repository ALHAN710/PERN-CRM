import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { TCredentials } from "../../types/userType";
import { auth } from "./firebase-config";

type TResultSignIn = {
  currentUser?: UserCredential;
  toastMessage: string;
  alertMessage: string;
  success: boolean;
};

export const firebaseSignIn = async ({
  email,
  password,
}: TCredentials): Promise<TResultSignIn> => {
  try {
    const user = await signInWithEmailAndPassword(auth, email, password);
    return {
      currentUser: user,
      toastMessage: "You're now connected 👌 !",
      alertMessage: "",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    let toastMessage = "Something went wrong 🤔 !";
    let alertMessage = "Oops, Something went wrong, please try again later !";
    if (error.code) {
      switch (error.code) {
        case "auth/user-disabled":
          console.log("======= auth/user-disabled Error =========");
          toastMessage = "User Account disabled 😴 !";
          alertMessage =
            "Sorry, your account is disabled, please contact the administrator for more details !";
          break;

          case "auth/email-invalid":
            toastMessage = "Incorrect User credentials 😪 !";
            alertMessage =
              "Your credentials are incorrect, please modify something and submit again !";
            
          default:
          break;
      }
    }
    
    return Promise.reject({
      toastMessage,
      alertMessage,
      success: false,
    });

    /*throw new Error(JSON.stringify({
        toastMessage,
        alertMessage,
        success: false,
      }));*/

    // return {
    //   toastMessage,
    //   alertMessage,
    //   success: false,
    // };
  }
};

export const firebaseSignOut = async (): Promise<Boolean> => {
  try {
    await auth.signOut();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
