"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseErrorsHandle = exports.isIFirebaseError = void 0;
const unauthenticated_error_1 = require("../errors/unauthenticated-error");
const unprocessable_error_1 = require("../errors/unprocessable-error");
function isIFirebaseError(object_) {
    return "code" in object_ && "message" in object_ && "codePrefix" in object_;
}
exports.isIFirebaseError = isIFirebaseError;
const firebaseErrorsHandle = ({ code, codePrefix }, next, action = "create") => {
    console.log('======= Firebase Error Handler =========');
    switch (code) {
        case "auth/id-token-expired":
            console.log('======= auth/id-token-expired Error =========');
            next(new unauthenticated_error_1.UnAuthenticatedError("The provided token is expired. Please try to reconnect."));
            break;
        case "auth/email-already-exists":
            console.log('======= auth/email-already-exists Error =========');
            next(new unprocessable_error_1.UnprocessableError("User", action));
            // next(new UnprocessableError("User", action, "Address Email already exists in the database."));
            break;
        case "auth/uid-already-exists":
            console.log('======= auth/uid-already-exists Error =========');
            next(new unprocessable_error_1.UnprocessableError("User", action));
            break;
        default:
            break;
    }
};
exports.firebaseErrorsHandle = firebaseErrorsHandle;
//# sourceMappingURL=firebase-errors-handle.js.map