import { Router } from 'express';
import { EmailController } from '../controllers/emailController';

const router = Router();
const emailController = new EmailController();

// Route to fetch emails
router.get('/emails', emailController.fetchEmails.bind(emailController));

// Route to categorize a single email by ID
router.post('/emails/:emailId/categorize', emailController.categorizeEmail.bind(emailController));

// Route to search emails
router.get('/emails/search', emailController.searchEmails.bind(emailController));

export default router;