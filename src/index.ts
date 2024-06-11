import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import compression from "compression";
import cors from "cors";
import SwaggerUi from "swagger-ui-express";
import Document from "../swagger.json";
import router from "./routes";
import httpStatus from "http-status";
import initializeSocket from "./services/sockets";
import { setSocketServer } from "./modules/user/controller/userControllers";

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT;
const { server,io } = initializeSocket(app);

app.use(express.json());
app.use(morgan(process.env.NODE_EN));
app.use(compression());
app.use(cors());
app.use("/api-docs", SwaggerUi.serve, SwaggerUi.setup(Document));
app.use("/api", router);

app.get("**", (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    status: true,
    message: "Welcome to the e-Commerce Ninjas BackEnd."
  });
});

setSocketServer(io)
server.listen(PORT, () => {
  console.log(`Server is running on the port ${PORT}`);
});

export default app;