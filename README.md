# Email Onebox App

## Overview

The Email Onebox App is a feature-rich email aggregator that synchronizes multiple IMAP email accounts in real-time. It provides a seamless, searchable, and AI-powered experience for managing emails. The application is built using TypeScript and Node.js for the backend, and React for the frontend.

## Features

1. **Real-Time Email Synchronization**: Syncs multiple IMAP accounts and fetches the last 30 days of emails using persistent IMAP connections.
2. **Searchable Storage**: Utilizes Elasticsearch for storing and indexing emails, allowing for efficient searching and filtering.
3. **AI-Based Email Categorization**: Implements an AI model to categorize emails into predefined labels such as Interested, Meeting Booked, Not Interested, Spam, and Out of Office.
4. **Slack & Webhook Integration**: Sends notifications to Slack for new interested emails and triggers webhooks for external automation.
5. **Frontend Interface**: Provides a simple UI to display emails, filter by folder/account, and show AI categorization.
6. **AI-Powered Suggested Replies**: Uses a vector database and RAG (Retrieval-Augmented Generation) to suggest replies based on the context of received emails.

## Project Structure

```
email-onebox-app
├── backend
│   ├── src
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── docker-compose.yml
└── README.md
```

## Setup Instructions

### Prerequisites

1. **Node.js**: Ensure you have the latest LTS version of Node.js installed.
2. **Docker**: Install Docker to run Elasticsearch.
3. **TypeScript**: Install TypeScript globally if it is not already installed.

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd email-onebox-app
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

### Configuration

Before running the application, configure your IMAP and Elasticsearch settings in the `backend/src/config/index.ts` file.

### Running the Application

1. Start Elasticsearch using Docker:
   ```
   docker-compose up
   ```

2. Start the backend server:
   ```
   cd backend
   npm start
   ```

3. Start the frontend application:
   ```
   cd ../frontend
   npm start
   ```

## Demo

A demo video showcasing the functionalities of the Email Onebox App will be provided separately.

## Contribution

Feel free to contribute to the project by submitting issues or pull requests. Your feedback and suggestions are welcome!

## License

This project is licensed under the MIT License.