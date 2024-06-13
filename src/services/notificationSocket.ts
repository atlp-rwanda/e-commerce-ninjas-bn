import { Server } from "socket.io";

const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {

    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("disconnect", () => {
    });
  });
};

export default setupSocket;