"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    imap: {
        host: process.env.IMAP_HOST || 'imap.example.com',
        port: parseInt(process.env.IMAP_PORT || '993', 10),
        user: process.env.IMAP_USER || 'user@example.com',
        password: process.env.IMAP_PASSWORD || 'yourpassword',
        tls: true,
    },
    elasticsearch: {
        host: process.env.ELASTICSEARCH_HOST || 'http://localhost:9200',
        username: process.env.ELASTICSEARCH_USER || 'elastic',
        password: process.env.ELASTICSEARCH_PASSWORD || 'yourpassword',
    },
    slack: {
        webhookUrl: process.env.SLACK_WEBHOOK_URL || 'https://hooks.slack.com/services/your/webhook/url',
    },
    webhook: {
        url: process.env.WEBHOOK_URL || 'https://webhook.site/your-webhook-url',
    },
};
exports.default = config;
