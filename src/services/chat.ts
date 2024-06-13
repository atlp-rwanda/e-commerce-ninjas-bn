import { Server, Socket } from "socket.io";
import { socketAuthMiddleware } from "../middlewares/authorization";
import db from "../databases/models";

const Chat = (io: Server) => {
  const chatNamespace = io.of("/chats");
  chatNamespace.use(socketAuthMiddleware);

  chatNamespace.on("connection", (socket: Socket) => {
    const { user } = socket.data;
    chatNamespace.emit("userJoined", { user });

    socket.on("chatMessage", async (message) => {
      try {
        const chat = await db.Chats.create({ userId: user.id, message });
        const fullChat = await db.Chats.findOne({
          where: { id: chat.id },
          include: [
            {
              model: db.Users,
              as: "user",
              attributes: ["id", "firstName", "lastName", "email"]
            }
          ]
        });
        socket.broadcast.emit("chatMessage", { user, message: fullChat.message });
      } catch (error) {
        console.error("Error in chatMessage:", error);
      }
    });

    socket.on("requestPastMessages", async () => {
      try {
        const chats = await db.Chats.findAll({
          order: [["createdAt", "ASC"]],
          include: [
            {
              model: db.Users,
              as: "user",
              attributes: ["id", "firstName", "lastName", "email"]
            }
          ]
        });
        socket.emit("pastMessages", chats);
      } catch (error) {
        console.error("Error in requestPastMessages:", error);
      }
    });

    socket.on("disconnect", () => {
      chatNamespace.emit("userLeft", { user });
    });
  });
};

export default Chat;
