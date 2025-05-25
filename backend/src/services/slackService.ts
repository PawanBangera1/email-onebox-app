import axios from 'axios';

export class SlackService {
    private webhookUrl: string;

    constructor(webhookUrl: string) {
        this.webhookUrl = webhookUrl;
    }

    public async sendNotification(message: string): Promise<void> {
        try {
            await axios.post(this.webhookUrl, {
                text: message,
            });
        } catch (error) {
            console.error('Error sending Slack notification:', error);
        }
    }
}