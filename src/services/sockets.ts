import { Server } from "socket.io";
import { createServer } from "http";
import { Express } from "express";

const initializeSocket = (app: Express) => {
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("connected");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("chat message", (msg) => {
      socket.broadcast.emit("chat message", msg); 
    });
  });

  return { server, io };
};

export default initializeSocket;
