import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import compression from "compression";
import cors from "cors";
import routes from "./routes";
import SwaggerUi from "swagger-ui-express";
import Document from "../swagger.json";
import { syncDatabase, connectToDatabase } from "./databases/config/database";

const PORT = process.env.PORT || 9090;
const app = express();

connectToDatabase();
syncDatabase();

app.use(express.json());
app.use(morgan("dev"));
app.use(compression());
app.use(cors());
app.use("/docs", SwaggerUi.serve, SwaggerUi.setup(Document));

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: true, message: "Welcome to E-Commerce-Ninja-BackEnd" });
});
app.use("/api", routes);
app.use((req: Request, res: Response) => {
  res.status(400).json({
    status: false,
    message: `Route ${req.method} ${req.url} not found.`,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
