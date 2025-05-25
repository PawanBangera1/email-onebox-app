"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailController = void 0;
const imapService_1 = require("../services/imapService");
const elasticsearchService_1 = require("../services/elasticsearchService");
const aiCategorizationService_1 = require("../services/aiCategorizationService");
class EmailController {
    constructor() {
        this.imapService = new imapService_1.IMAPService();
        this.elasticsearchService = new elasticsearchService_1.ElasticsearchService();
        this.aiCategorizationService = new aiCategorizationService_1.AICategorizationService();
    }
    async fetchEmails(req, res) {
        try {
            const emails = await this.imapService.fetchRecentEmails();
            const categorizedEmails = await Promise.all(emails.map(email => this.aiCategorizationService.categorizeEmail(email)));
            await Promise.all(categorizedEmails.map(email => this.elasticsearchService.indexEmail(email)));
            res.status(200).json(categorizedEmails);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching emails', error });
        }
    }
    async searchEmails(req, res) {
        const { query } = req.body;
        try {
            const results = await this.elasticsearchService.searchEmails(query);
            res.status(200).json(results);
        }
        catch (error) {
            res.status(500).json({ message: 'Error searching emails', error });
        }
    }
    async categorizeEmail(req, res) {
        const { emailId } = req.params;
        try {
            const email = await this.elasticsearchService.getEmailById(emailId);
            if (!email) {
                res.status(404).json({ message: 'Email not found' });
                return;
            }
            const categorizedEmail = await this.aiCategorizationService.categorizeEmail(email);
            res.status(200).json(categorizedEmail);
        }
        catch (error) {
            res.status(500).json({ message: 'Error categorizing email', error });
        }
    }
}
exports.EmailController = EmailController;
