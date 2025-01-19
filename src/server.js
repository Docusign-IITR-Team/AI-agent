import express from 'express';
import { analyzeAgreement, generateAgreement, analyzeQuery, generateWitness } from './groq.js';
import dotenv from 'dotenv';
import path from 'path';
import { categories } from './categories.js';
import {AddFile, createAndStoreEmbedding} from "../script.js";
import fs from 'fs';
import { notifyDeadlines } from './notification.js';
dotenv.config();
createAndStoreEmbedding("data/", process.env.GOOGLE_API_KEY, "agreement");
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
        let { answers } = req.body;

        if (!categories[category]) {
            return res.status(400).json({ error: 'Invalid category' });
        }

        if (!answers) {
            return res.status(400).json({ error: 'No answers provided' });
        }

        // Remove any category from answers object as we use the URL parameter
        delete answers.category;

        // Read template file with absolute path
        const templatePath = path.join(process.cwd(), 'public', categories[category].template);
        console.log('Reading template from:', templatePath);
        
        if (!fs.existsSync(templatePath)) {
            console.error(`Template file not found at ${templatePath}`);
            return res.status(500).json({ error: 'Template file not found' });
        }

        const templateContent = fs.readFileSync(templatePath, 'utf-8');
        console.log('Template content length:', templateContent.length);

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
        const { text, fileName } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }
        const analysis = await analyzeAgreement(text);
        fs.writeFileSync(`data/${fileName}.txt`, JSON.stringify(text, null, 2));

        fs.writeFileSync("data/results/agreement_result.json", JSON.stringify(analysis, null, 2));
        await AddFile(`data/${fileName}.txt`);
        res.json(analysis);
    } catch (error) {

        console.error('Error analyzing agreement:', error);
        res.status(500).json({ error: 'Error analyzing agreement' });
    }
});

app.post('/chat', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }
        // console.log("TEXTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",text);
        const analysis = await analyzeQuery(text);
        console.log("ANAYLYSISSSSSS",analysis);
        res.json(analysis);
    } catch (error) {
        console.error('Error analyzing agreement:', error);
        res.status(500).json({ error: 'Error analyzing agreement' });
    }
});

app.post('/witness', async (req, res) => {
    try {
        const { fileName } = req.body;
        if (!fileName) {
            return res.status(400).json({ error: 'No text provided' });
        }

        const analysis = await generateWitness(fileName);
        res.json(analysis);
    } catch (error) {
        console.error('Error analyzing agreement:', error);
        res.status(500).json({ error: 'Error analyzing agreement' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    notifyDeadlines();
});
