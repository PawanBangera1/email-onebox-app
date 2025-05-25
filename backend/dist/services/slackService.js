"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackService = void 0;
const axios_1 = __importDefault(require("axios"));
class SlackService {
    constructor(webhookUrl) {
        this.webhookUrl = webhookUrl;
    }
    async sendNotification(message) {
        try {
            await axios_1.default.post(this.webhookUrl, {
                text: message,
            });
        }
        catch (error) {
            console.error('Error sending Slack notification:', error);
        }
    }
}
exports.SlackService = SlackService;
