"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AICategorizationService = void 0;
const tsyringe_1 = require("tsyringe");
let AICategorizationService = class AICategorizationService {
    constructor() {
        this.categories = ['Interested', 'Meeting Booked', 'Not Interested', 'Spam', 'Out of Office'];
    }
    async categorizeEmail(email) {
        // Placeholder for AI categorization logic
        const content = email.body.toLowerCase();
        let category = 'Not Interested';
        if (content.includes('interested')) {
            category = 'Interested';
        }
        else if (content.includes('meeting')) {
            category = 'Meeting Booked';
        }
        else if (content.includes('not interested')) {
            category = 'Not Interested';
        }
        else if (content.includes('spam')) {
            category = 'Spam';
        }
        else if (content.includes('out of office')) {
            category = 'Out of Office';
        }
        return { ...email, category };
    }
};
AICategorizationService = __decorate([
    (0, tsyringe_1.injectable)()
], AICategorizationService);
exports.AICategorizationService = AICategorizationService;
