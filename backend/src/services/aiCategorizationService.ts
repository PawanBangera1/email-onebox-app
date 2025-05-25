import { injectable } from 'tsyringe';
import { Email } from '../models/email';

@injectable()
export class AICategorizationService {
    private categories = ['Interested', 'Meeting Booked', 'Not Interested', 'Spam', 'Out of Office'];

    constructor() {}

    public async categorizeEmail(email: Email): Promise<Email> {
        // Placeholder for AI categorization logic
        const content = email.body.toLowerCase();

        let category: Email['category'] = 'Not Interested';
        if (content.includes('interested')) {
            category = 'Interested';
        } else if (content.includes('meeting')) {
            category = 'Meeting Booked';
        } else if (content.includes('not interested')) {
            category = 'Not Interested';
        } else if (content.includes('spam')) {
            category = 'Spam';
        } else if (content.includes('out of office')) {
            category = 'Out of Office';
        }

        return { ...email, category };
    }
}