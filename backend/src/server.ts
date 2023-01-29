import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { NotFoundError } from "./errors/not-found-error";
import { currentUser } from "./middlewares/current-user";
import { errorHandler } from "./middlewares/error-handler";
import router from "./routes";
import path from "path";

const app = express();


// ================================  Middleware section ================================
app.use(express.static(path.join(__dirname, "../../client/dist")));
// app.use(express.static(path.join(__dirname, "../../client/dist/assets")));

// ========== Middleware pour la récupération des données au format JSON provenant du Front-End
    // Pour les données directement envoyées du Front-End au format JSON par exple via Axios ou Fetch ou AJAX
app.use(express.json());
app.use(cors());
app.use(currentUser);

app.use(router);
app.all('*', async (req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError());
});

app.use(errorHandler);

export default app;