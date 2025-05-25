export interface Email {
    id: string;
    subject: string;
    from: string;
    to: string;
    date: Date;
    body: string;
    text?: string;
    html?: string;
    folder: string;
    account: string;
    category: EmailCategory;
}

export enum EmailCategory {
    Interested = "Interested",
    MeetingBooked = "Meeting Booked",
    NotInterested = "Not Interested",
    Spam = "Spam",
    OutOfOffice = "Out of Office"
}

export interface IMAPConfig {
    host: string;
    port: number;
    user: string;
    password: string;
}

export interface ElasticsearchConfig {
    host: string;
    port: number;
    index: string;
}

export interface SlackConfig {
    webhookUrl: string;
}

export interface WebhookConfig {
    url: string;
}