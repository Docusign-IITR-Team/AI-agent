import express from 'express';
import { analyzeAgreement, generateAgreement } from './groq.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { categories } from './categories.js';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Get available categories and their questions
app.get('/categories', (req, res) => {
    res.json(categories);
});

// Generate agreement based on category and answers
app.post('/generate/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const { answers } = req.body;

        if (!categories[category]) {
            return res.status(400).json({ error: 'Invalid category' });
        }

        if (!answers) {
            return res.status(400).json({ error: 'No answers provided' });
        }

        // Read template file with absolute path
        const templatePath = path.join(process.cwd(), 'data', 'rent.txt');
        console.log('Reading template from:', templatePath);
        
        if (!fs.existsSync(templatePath)) {
            return res.status(500).json({ error: 'Template file not found' });
        }

        const templateContent = fs.readFileSync(templatePath, 'utf-8');
        console.log('Template content:', templateContent);

        // Generate agreement
        const generatedAgreement = await generateAgreement(category, answers, templateContent);
        console.log('Generated agreement length:', generatedAgreement.length);
        
        if (!generatedAgreement || generatedAgreement.length < 100) {
            console.error('Generated agreement is too short or empty');
            return res.status(500).json({ error: 'Failed to generate complete agreement' });
        }

        // Set appropriate headers for large response
        res.setHeader('Content-Type', 'application/json');
        // Don't use chunked encoding, let Express handle it
        
        const response = {
            category: categories[category].heading,
            agreement: generatedAgreement
        };

        console.log('Sending response with agreement length:', response.agreement.length);
        res.json(response);
    } catch (error) {
        console.error('Error generating agreement:', error);
        res.status(500).json({ error: 'Error generating agreement: ' + error.message });
    }
});

// Analyze existing agreement
app.post('/analyze', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }

        const analysis = await analyzeAgreement(text);
        res.json(analysis);
    } catch (error) {
        console.error('Error analyzing agreement:', error);
        res.status(500).json({ error: 'Error analyzing agreement' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
