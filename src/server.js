import express from 'express';
import { analyzeAgreement } from './groq.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

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
