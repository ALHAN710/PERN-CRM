"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.app = void 0;
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const config_1 = require("./config");
const app = (0, app_1.initializeApp)({
    credential: (0, app_1.cert)({
        projectId: config_1.projectId,
        clientEmail: config_1.clientEmail,
        privateKey: config_1.privateKey,
    }),
    storageBucket: config_1.storageBucket,
    projectId: config_1.projectId,
});
exports.app = app;
const auth = (0, auth_1.getAuth)();
exports.auth = auth;
//# sourceMappingURL=firebase.js.map