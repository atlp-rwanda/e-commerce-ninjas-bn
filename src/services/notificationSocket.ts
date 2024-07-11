import { Server } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";

const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    socket.on("join", (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        const userId = decoded.id;
        socket.join(userId);
      } catch (error) {
        console.error("Invalid token");
      }
    });
    socket.on("disconnect", () => {
    });
  });
};

export default setupSocket;
