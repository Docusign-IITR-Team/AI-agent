import express from 'express';
import { analyzeAgreement, analyzeQuery, generateWitness } from './groq.js';
import dotenv from 'dotenv';
import {AddFile, createAndStoreEmbedding} from "../script.js";

dotenv.config();
createAndStoreEmbedding("data/", process.env.GOOGLE_API_KEY, "agreement");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.post('/analyze', async (req, res) => {
    try {
        const { text, fileName } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }
        fs.writeFileSync(`data/${fileName}.txt`, JSON.stringify(analysis, null, 2));
        const analysis = await analyzeAgreement(text);

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

        const analysis = await analyzeQuery(text);
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
});
