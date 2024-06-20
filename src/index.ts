import express, { Express, Request, Response ,NextFunction} from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import compression from "compression";
import cors from "cors";
import SwaggerUi from "swagger-ui-express";
import Document from "../swagger.json";
import router from "./routes";
import httpStatus from "http-status";
import chat from "./services/chat";
import { createServer } from "http";
import { Server } from "socket.io";
import setupSocket from "./services/notificationSocket";
import "./services/cronJob"

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT
const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
chat(io);
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl === "/api/cart/webhook") {
    express.raw({ type: "application/json" })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});
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


server.listen(PORT, () => {
  console.log(`Server is running on the port ${PORT}`);
});

export default app;