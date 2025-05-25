import axios from 'axios';

export class WebhookService {
    private webhookUrl: string;

    constructor(webhookUrl: string) {
        this.webhookUrl = webhookUrl;
    }

    public async triggerWebhook(data: any): Promise<void> {
        try {
            await axios.post(this.webhookUrl, data);
        } catch (error) {
            console.error('Error triggering webhook:', error);
        }
    }
}