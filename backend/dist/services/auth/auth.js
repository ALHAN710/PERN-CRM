"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseUpdate = exports.firebaseSignUp = void 0;
const firebase_1 = require("../firebase");
const firebaseSignUp = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const userRecord = yield firebase_1.auth.createUser({
        //uid: "some-uid",
        email,
        password,
        //phoneNumber: "+11234567890",
        disabled: true,
    });
    return userRecord;
    /*try {
    } catch (error: any) {
      // const error_ = error as FirebaseError;
      console.log("============ Firebase SignUp Error ============");
      // console.log(error);
      // console.log("Code", error.code);
      // console.log("Message", error.message);
      throw new Error(error);
      
      //next(new UnprocessableError("User"));
    }*/
});
exports.firebaseSignUp = firebaseSignUp;
const firebaseUpdate = (currentUser, email) => __awaiter(void 0, void 0, void 0, function* () {
    const userUpdated = yield firebase_1.auth.updateUser(currentUser.uid, {
        email
    });
    return userUpdated;
    /*try {
      
    } catch (error: any) {
      
      // const error_ = error as FirebaseError;
      console.log("============ Firebase Update User Error ============");
      throw new Error(error);
      // console.log(error);
      // console.log("Code", error_.code);
      // console.log("Message", error_.message);
        
      // throw new UnprocessableError("User", "create");
    }
    */
});
exports.firebaseUpdate = firebaseUpdate;
//# sourceMappingURL=auth.js.map