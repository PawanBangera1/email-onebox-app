"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElasticsearchService = void 0;
const elasticsearch_1 = require("@elastic/elasticsearch");
class ElasticsearchService {
    constructor() {
        this.client = new elasticsearch_1.Client({ node: 'http://localhost:9200' });
    }
    async indexEmail(email) {
        await this.client.index({
            index: 'emails',
            id: email.id,
            document: email, // <-- changed from body to document
        });
    }
    async searchEmails(query) {
        const result = await this.client.search({
            index: 'emails',
            query: {
                multi_match: {
                    query,
                    fields: ['subject', 'body', 'from', 'to'],
                },
            },
        });
        return result.hits.hits.map((hit) => hit._source);
    }
    async getEmailById(emailId) {
        try {
            const result = await this.client.get({
                index: 'emails',
                id: emailId,
            });
            return result._source;
        }
        catch (error) {
            if (error.meta && error.meta.statusCode === 404) {
                return null;
            }
            throw error;
        }
    }
    async deleteEmail(emailId) {
        await this.client.delete({
            index: 'emails',
            id: emailId,
        });
    }
    async updateEmail(emailId, email) {
        await this.client.update({
            index: 'emails',
            id: emailId,
            doc: email, // <-- changed from body: { doc: email } to doc: email
        });
    }
}
exports.ElasticsearchService = ElasticsearchService;
