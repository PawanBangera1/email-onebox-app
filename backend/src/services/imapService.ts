import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { EventEmitter } from 'events';
import config from '../config';
import { Email } from '../models/email';

function extractAddresses(addressObj: any): string {
    if (addressObj && Array.isArray(addressObj.value)) {
        return addressObj.value.map((v: any) => v.address).join(', ');
    }
    return '';
}

export class IMAPService extends EventEmitter {
    private clients: Map<string, Imap> = new Map();

    constructor() {
        super();
    }

    public addAccount(email: string, password: string) {
        const client = new Imap({
            user: email,
            password: password,
            host: config.imap.host,
            port: config.imap.port,
            tls: true,
            authTimeout: 3000,
        });

        client.once('ready', () => {
            console.log(`Connected to ${email}`);
            client.on('mail', () => this.fetchEmails(client, email));
            client.openBox('INBOX', true, (err: any) => {
                if (err) throw err;
                client.on('mail', () => this.fetchEmails(client, email));
            });
        });

        client.connect();
        this.clients.set(email, client);
    }

    private fetchEmails(client: Imap, email: string) {
        client.search(['UNSEEN', ['SINCE', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()]], (err: any, results: any) => {
            if (err) throw err;
            if (!results || results.length === 0) return;

            const fetcher = client.fetch(results, { bodies: '' });
            fetcher.on('message', (msg: any) => {
                let buffer = '';
                msg.on('body', (stream: any) => {
                    stream.on('data', (chunk: any) => {
                        buffer += chunk.toString('utf8');
                    });
                    stream.on('end', async () => {
                        const parsed = await simpleParser(buffer);
                        const emailData: Email = {
                            id: parsed.messageId || '',
                            from: extractAddresses(parsed.from),
                            to: extractAddresses(parsed.to),
                            subject: parsed.subject || '',
                            body: parsed.text || '',
                            text: parsed.text || '',
                            html: parsed.html || '',
                            date: parsed.date || new Date(),
                            folder: 'INBOX',
                            account: email,
                            category: 'Not Interested', // default, can be updated later
                        };
                        this.emit('newEmail', emailData);
                    });
                });
            });
        });
    }

    public removeAccount(email: string) {
        const client = this.clients.get(email);
        if (client) {
            client.end();
            this.clients.delete(email);
            console.log(`Disconnected from ${email}`);
        }
    }

    // For controller compatibility
    public async fetchRecentEmails(): Promise<Email[]> {
        return new Promise((resolve, reject) => {
            const client = new Imap({
                user: config.imap.user,
                password: config.imap.password,
                host: config.imap.host,
                port: config.imap.port,
                tls: true,
                authTimeout: 3000,
            });

            const emails: Email[] = [];

            client.once('ready', () => {
                client.openBox('INBOX', true, (err: any, box: any) => {
                    if (err) return reject(err);

                    client.search(['ALL', ['SINCE', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()]], (err: any, results: any) => {
                        if (err) return reject(err);
                        if (!results || results.length === 0) {
                            client.end();
                            return resolve(emails);
                        }

                        const fetcher = client.fetch(results, { bodies: '' });
                        let pending = results.length;
                        fetcher.on('message', (msg: any) => {
                            let buffer = '';
                            msg.on('body', (stream: any) => {
                                stream.on('data', (chunk: any) => {
                                    buffer += chunk.toString('utf8');
                                });
                                stream.on('end', async () => {
                                    const parsed = await simpleParser(buffer);
                                    emails.push({
                                        id: parsed.messageId || '',
                                        from: extractAddresses(parsed.from),
                                        to: extractAddresses(parsed.to),
                                        subject: parsed.subject || '',
                                        body: parsed.text || '',
                                        text: parsed.text || '',
                                        html: parsed.html || '',
                                        date: parsed.date || new Date(),
                                        folder: 'INBOX',
                                        account: config.imap.user,
                                        category: 'Not Interested',
                                    });
                                    pending--;
                                    if (pending === 0) {
                                        client.end();
                                        resolve(emails);
                                    }
                                });
                            });
                        });
                        fetcher.once('error', (err: any) => {
                            client.end();
                            reject(err);
                        });
                        fetcher.once('end', () => {
                            // If all messages are already parsed, resolve here as well
                            if (pending === 0) {
                                client.end();
                                resolve(emails);
                            }
                        });
                    });
                });
            });

            client.once('error', (err: any) => {
                reject(err);
            });

            client.connect();
        });
    }
}