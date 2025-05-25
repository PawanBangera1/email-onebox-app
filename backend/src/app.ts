import express from 'express';
import { json } from 'body-parser';
import cors from 'cors'; // <-- Add this line
import emailRoutes from './routes/emailRoutes';
import config from './config';

const app = express();

// Middleware
app.use(cors()); // <-- Add this line
app.use(json());

// Routes
app.use('/api/emails', emailRoutes);

export default app;