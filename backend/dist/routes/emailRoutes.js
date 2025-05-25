"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emailController_1 = require("../controllers/emailController");
const router = (0, express_1.Router)();
const emailController = new emailController_1.EmailController();
// Route to fetch emails
router.get('/emails', emailController.fetchEmails.bind(emailController));
// Route to categorize a single email by ID
router.post('/emails/:emailId/categorize', emailController.categorizeEmail.bind(emailController));
// Route to search emails
router.get('/emails/search', emailController.searchEmails.bind(emailController));
exports.default = router;
