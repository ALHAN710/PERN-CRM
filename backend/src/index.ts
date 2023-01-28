import dotenv from "dotenv";
import app from "./server";
import { port } from "./services/config";

dotenv.config();

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
