require('dotenv').config(); 
const express = require('express');
const OpenAI = require('openai'); 
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize OpenAI client pointing to OpenRouter
const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000", // Optional, for OpenRouter rankings
        "X-Title": "StudyFlow AI Tutor",         // Optional
    }
});

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    try {
        const response = await openai.chat.completions.create({
            model: "openai/gpt-3.5-turbo", // Note the "openai/" prefix for OpenRouter
            messages: [
                { role: "system", content: "You are a helpful AI Study Tutor." },
                { role: "user", content: message }
            ],
        });

        const reply = response.choices[0].message.content;
        res.json({ reply });

    } catch (error) {
        // Log the exact error to your VS Code terminal
        console.error("OpenRouter Error:", error.message); 
        res.status(500).json({ reply: "I'm having trouble thinking. Check your OpenRouter key and balance." });
    }
});

app.listen(port, () => {
    console.log(`🚀 Server running at: http://localhost:${port}`);
});