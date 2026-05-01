require('dotenv').config(); 
const express = require('express');
const OpenAI = require('openai'); 
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('StudyFlow backend is running');
});

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    try {
        const response = await openai.chat.completions.create({
            model: "openai/gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful AI Study Tutor." },
                { role: "user", content: message }
            ],
        });

        res.json({ reply: response.choices[0].message.content });

    } catch (error) {
        console.error("OpenRouter Error:", error.message);
        res.status(500).json({ reply: "Error from AI service." });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
