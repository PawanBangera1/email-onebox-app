"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const axios_1 = __importDefault(require("axios"));
class WebhookService {
    constructor(webhookUrl) {
        this.webhookUrl = webhookUrl;
    }
    async triggerWebhook(data) {
        try {
            await axios_1.default.post(this.webhookUrl, data);
        }
        catch (error) {
            console.error('Error triggering webhook:', error);
        }
    }
}
exports.WebhookService = WebhookService;
