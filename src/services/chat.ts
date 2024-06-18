import { Server, Socket } from "socket.io";
import { socketAuthMiddleware } from "../middlewares/authorization";
import userRepositories from "../modules/user/repository/userRepositories";

const Chat = (io: Server) => {
  const chatNamespace = io.of("/chats");
  chatNamespace.use(socketAuthMiddleware);

  chatNamespace.on("connection", (socket: Socket) => {
    const { user } = socket.data;
    chatNamespace.emit("userJoined", { user });

    socket.on("chatMessage", async (message) => {
      try {
        const fullChat = await userRepositories.postChatMessage(user.id, message);
        socket.broadcast.emit("chatMessage", { user, message: fullChat.message });
      } catch (error) {
        console.error("Error in chatMessage:", error);
      }
    });

    socket.on("requestPastMessages", async () => {
      try {
        const chats = await userRepositories.getAllPastChats()
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
