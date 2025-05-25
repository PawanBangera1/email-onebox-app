export interface Email {
    id: string;
    from: string;
    to: string;
    subject: string;
    body: string;
    text?: string;   // Add this line
    html?: string;   // Add this line
    date: Date;
    folder: string;
    account: string;
    category: 'Interested' | 'Meeting Booked' | 'Not Interested' | 'Spam' | 'Out of Office';
}