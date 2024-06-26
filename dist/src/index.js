"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
const routes_1 = __importDefault(require("./routes"));
const http_status_1 = __importDefault(require("http-status"));
const chat_1 = __importDefault(require("./services/chat"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
require("./services/cronJob");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
(0, chat_1.default)(io);
app.use(express_1.default.json());
app.use((0, morgan_1.default)(process.env.NODE_EN));
app.use((0, compression_1.default)());
app.use((0, cors_1.default)());
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.use("/api", routes_1.default);
app.get("**", (req, res) => {
    res.status(http_status_1.default.OK).json({
        status: true,
        message: "Welcome to the e-Commerce Ninjas BackEnd."
    });
});
server.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map