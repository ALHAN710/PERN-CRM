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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const not_found_error_1 = require("./errors/not-found-error");
const current_user_1 = require("./middlewares/current-user");
const error_handler_1 = require("./middlewares/error-handler");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// ================================  Middleware section ================================
// ========== Middleware pour la récupération des données au format JSON provenant du Front-End
// Pour les données directement envoyées du Front-End au format JSON par exple via Axios ou Fetch ou AJAX
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(current_user_1.currentUser);
app.use(routes_1.default);
app.all('*', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    next(new not_found_error_1.NotFoundError());
}));
app.use(error_handler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=server.js.map