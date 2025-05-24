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

app.post('/chatV2', async (req: Request, res: Response): Promise<void> => {
  try {
    // const { messages, model = 'gpt-3.5-turbo' } = req.body;
    const { messages } = req.body as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Messages array is required' });
      return;
    }

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
    });

    if (!completion.choices[0]?.message) {
      throw new Error('No response from OpenAI');
    }

    res.json({
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    if (error instanceof Error) {
      // Handle quota and billing errors
      if (error.message.includes('quota') || error.message.includes('billing')) {
        res.status(429).json({ 
          error: 'OpenAI API quota exceeded. Please check your billing status.',
          details: error.message
        });
      }
      // Handle API key errors
      if (error.message.includes('API key')) {
        res.status(401).json({ 
          error: 'Invalid API key',
          details: error.message
        });
      }
      // Handle rate limit errors
      if (error.message.includes('rate limit')) {
        res.status(429).json({ 
          error: 'Rate limit exceeded. Please try again later.',
          details: error.message
        });
      }
    }

    res.status(500).json({ 
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`API running on port:${PORT}`);
});
