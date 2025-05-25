import { Request, Response } from 'express';
import { IMAPService } from '../services/imapService';
import { ElasticsearchService } from '../services/elasticsearchService';
import { AICategorizationService } from '../services/aiCategorizationService';

export class EmailController {
    private imapService: IMAPService;
    private elasticsearchService: ElasticsearchService;
    private aiCategorizationService: AICategorizationService;

    constructor() {
        this.imapService = new IMAPService();
        this.elasticsearchService = new ElasticsearchService();
        this.aiCategorizationService = new AICategorizationService();
    }

    public async fetchEmails(req: Request, res: Response): Promise<void> {
        try {
            const emails = await this.imapService.fetchRecentEmails();
            const categorizedEmails = await Promise.all(
                emails.map(email => this.aiCategorizationService.categorizeEmail(email))
            );
            await Promise.all(
                categorizedEmails.map(email => this.elasticsearchService.indexEmail(email))
            );
            res.status(200).json(categorizedEmails);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching emails', error });
        }
    }

    public async searchEmails(req: Request, res: Response): Promise<void> {
        const { query } = req.body;
        try {
            const results = await this.elasticsearchService.searchEmails(query);
            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ message: 'Error searching emails', error });
        }
    }

    public async categorizeEmail(req: Request, res: Response): Promise<void> {
    const { emailId } = req.params;
    try {
        const email = await this.elasticsearchService.getEmailById(emailId);
        if (!email) {
            res.status(404).json({ message: 'Email not found' });
            return;
        }
        const categorizedEmail = await this.aiCategorizationService.categorizeEmail(email);
        res.status(200).json(categorizedEmail);
    } catch (error) {
        res.status(500).json({ message: 'Error categorizing email', error });
    }
}
}