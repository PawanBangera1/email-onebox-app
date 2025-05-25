"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMAPService = void 0;
const imap_1 = __importDefault(require("imap"));
const mailparser_1 = require("mailparser");
const events_1 = require("events");
const config_1 = __importDefault(require("../config"));
function extractAddresses(addressObj) {
    if (addressObj && Array.isArray(addressObj.value)) {
        return addressObj.value.map((v) => v.address).join(', ');
    }
    return '';
}
class IMAPService extends events_1.EventEmitter {
    constructor() {
        super();
        this.clients = new Map();
    }
    addAccount(email, password) {
        const client = new imap_1.default({
            user: email,
            password: password,
            host: config_1.default.imap.host,
            port: config_1.default.imap.port,
            tls: true,
            authTimeout: 3000,
        });
        client.once('ready', () => {
            console.log(`Connected to ${email}`);
            client.on('mail', () => this.fetchEmails(client, email));
            client.openBox('INBOX', true, (err) => {
                if (err)
                    throw err;
                client.on('mail', () => this.fetchEmails(client, email));
            });
        });
        client.connect();
        this.clients.set(email, client);
    }
    fetchEmails(client, email) {
        client.search(['UNSEEN', ['SINCE', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()]], (err, results) => {
            if (err)
                throw err;
            if (!results || results.length === 0)
                return;
            const fetcher = client.fetch(results, { bodies: '' });
            fetcher.on('message', (msg) => {
                let buffer = '';
                msg.on('body', (stream) => {
                    stream.on('data', (chunk) => {
                        buffer += chunk.toString('utf8');
                    });
                    stream.on('end', async () => {
                        const parsed = await (0, mailparser_1.simpleParser)(buffer);
                        const emailData = {
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
    removeAccount(email) {
        const client = this.clients.get(email);
        if (client) {
            client.end();
            this.clients.delete(email);
            console.log(`Disconnected from ${email}`);
        }
    }
    // For controller compatibility
    async fetchRecentEmails() {
        return new Promise((resolve, reject) => {
            const client = new imap_1.default({
                user: config_1.default.imap.user,
                password: config_1.default.imap.password,
                host: config_1.default.imap.host,
                port: config_1.default.imap.port,
                tls: true,
                authTimeout: 3000,
            });
            const emails = [];
            client.once('ready', () => {
                client.openBox('INBOX', true, (err, box) => {
                    if (err)
                        return reject(err);
                    client.search(['ALL', ['SINCE', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()]], (err, results) => {
                        if (err)
                            return reject(err);
                        if (!results || results.length === 0) {
                            client.end();
                            return resolve(emails);
                        }
                        const fetcher = client.fetch(results, { bodies: '' });
                        let pending = results.length;
                        fetcher.on('message', (msg) => {
                            let buffer = '';
                            msg.on('body', (stream) => {
                                stream.on('data', (chunk) => {
                                    buffer += chunk.toString('utf8');
                                });
                                stream.on('end', async () => {
                                    const parsed = await (0, mailparser_1.simpleParser)(buffer);
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
                                        account: config_1.default.imap.user,
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
                        fetcher.once('error', (err) => {
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
            client.once('error', (err) => {
                reject(err);
            });
            client.connect();
        });
    }
}
exports.IMAPService = IMAPService;
