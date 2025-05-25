# Email Onebox App - Backend README

## Overview

This is the backend for the Email Onebox application, which provides a feature-rich email aggregator with real-time synchronization, AI-based categorization, and integration with external services like Slack and webhooks.

## Features

1. **Real-Time Email Synchronization**: Sync multiple IMAP accounts in real-time and fetch the last 30 days of emails.
2. **Searchable Storage**: Store emails in a locally hosted Elasticsearch instance, making them searchable and filterable by folder and account.
3. **AI-Based Email Categorization**: Automatically categorize emails into labels such as Interested, Meeting Booked, Not Interested, Spam, and Out of Office.
4. **Slack & Webhook Integration**: Send notifications for new interested emails and trigger webhooks for external automation.
5. **RESTful API**: Expose endpoints for email operations, including fetching and categorizing emails.

## Setup Instructions

### Prerequisites

1. **Node.js**: Ensure you have the latest LTS version of Node.js installed.
2. **Docker**: Install Docker to run Elasticsearch.
3. **TypeScript**: Install TypeScript globally if it is not already installed.

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd email-onebox-app/backend
   ```

2. Install the necessary dependencies:
   ```
   npm install
   ```

3. Configure your IMAP and Elasticsearch settings in the `src/config/index.ts` file.

4. Start the Elasticsearch service using Docker:
   ```
   docker-compose up -d
   ```

5. Start the backend server:
   ```
   npm run start
   ```

## Directory Structure

- `src/app.ts`: Initializes the Express application and connects to services.
- `src/server.ts`: Starts the server and listens for incoming requests.
- `src/config/index.ts`: Contains configuration settings for IMAP and Elasticsearch.
- `src/controllers/emailController.ts`: Handles API requests related to email operations.
- `src/services/`: Contains various services for IMAP, Elasticsearch, AI categorization, Slack notifications, and webhooks.
- `src/models/email.ts`: Defines the structure of an email object.
- `src/routes/emailRoutes.ts`: Exports email-related API routes.
- `src/types/index.ts`: Exports TypeScript types and interfaces.

## Running the Application

After completing the setup, you can access the API endpoints to interact with the email aggregator. Use tools like Postman to test the endpoints.

## Contribution

Feel free to contribute to this project by submitting issues or pull requests. Your feedback and contributions are welcome!

## License

This project is licensed under the MIT License. See the LICENSE file for details.