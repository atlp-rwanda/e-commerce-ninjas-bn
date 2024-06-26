"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authorization_1 = require("../middlewares/authorization");
const userRepositories_1 = __importDefault(require("../modules/user/repository/userRepositories"));
const Chat = (io) => {
    const chatNamespace = io.of("/chats");
    chatNamespace.use(authorization_1.socketAuthMiddleware);
    chatNamespace.on("connection", (socket) => {
        const { user } = socket.data;
        chatNamespace.emit("userJoined", { user });
        socket.on("chatMessage", async (message) => {
            try {
                const fullChat = await userRepositories_1.default.postChatMessage(user.id, message);
                socket.broadcast.emit("chatMessage", { user, message: fullChat.message });
            }
            catch (error) {
                console.error("Error in chatMessage:", error);
            }
        });
        socket.on("requestPastMessages", async () => {
            try {
                const chats = await userRepositories_1.default.getAllPastChats();
                socket.emit("pastMessages", chats);
            }
            catch (error) {
                console.error("Error in requestPastMessages:", error);
            }
        });
        socket.on("disconnect", () => {
            chatNamespace.emit("userLeft", { user });
        });
    });
};
exports.default = Chat;
//# sourceMappingURL=chat.js.map