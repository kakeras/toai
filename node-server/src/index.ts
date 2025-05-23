import express, { Request, Response } from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

app.post('/chat', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body as { messages: ChatMessage[] };

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages,
    });

    res.json({
      response: completion.choices[0].message.content,
    });
  } catch (err: any) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`API running on port:${PORT}`);
});
