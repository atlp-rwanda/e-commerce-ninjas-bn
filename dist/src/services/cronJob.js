"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const updateExpiredProducts_1 = __importDefault(require("../helpers/updateExpiredProducts"));
const passwordExpiryNotifications_1 = require("../helpers/passwordExpiryNotifications");
node_cron_1.default.schedule("0 6 * * *", async () => {
    try {
        console.log("Cron Job Started..");
        await (0, updateExpiredProducts_1.default)();
        await (0, passwordExpiryNotifications_1.checkPasswordExpirations)();
    }
    catch (error) {
        console.error(`Something wrong occurred " ${error.toString()} "`);
    }
}, { scheduled: true, timezone: "Asia/Kolkata" });
//# sourceMappingURL=cronJob.js.map