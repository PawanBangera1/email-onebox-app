import { Client } from '@elastic/elasticsearch';
import { Email } from '../models/email';

export class ElasticsearchService {
    private client: Client;

    constructor() {
        this.client = new Client({ node: 'http://localhost:9200' });
    }

    async indexEmail(email: Email): Promise<void> {
        await this.client.index({
            index: 'emails',
            id: email.id,
            document: email, // <-- changed from body to document
        });
    }

    async searchEmails(query: string): Promise<Email[]> {
        const result = await this.client.search({
            index: 'emails',
            query: { // <-- moved query out of body
                multi_match: {
                    query,
                    fields: ['subject', 'body', 'from', 'to'],
                },
            },
        });
        return (result as any).hits.hits.map((hit: any) => hit._source);
    }

    async getEmailById(emailId: string): Promise<Email | null> {
        try {
            const result = await this.client.get({
                index: 'emails',
                id: emailId,
            });
            return (result as any)._source as Email;
        } catch (error: any) {
            if (error.meta && error.meta.statusCode === 404) {
                return null;
            }
            throw error;
        }
    }

    async deleteEmail(emailId: string): Promise<void> {
        await this.client.delete({
            index: 'emails',
            id: emailId,
        });
    }

    async updateEmail(emailId: string, email: Email): Promise<void> {
        await this.client.update<Email, Partial<Email>>({
            index: 'emails',
            id: emailId,
            doc: email, // <-- changed from body: { doc: email } to doc: email
        });
    }
}