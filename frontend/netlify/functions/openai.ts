import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { messages, model = 'gpt-3.5-turbo' } = JSON.parse(event.body || '{}');

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Messages array is required' }),
      };
    }

    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
    });

    if (!completion.choices[0]?.message) {
      throw new Error('No response from OpenAI');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: completion.choices[0].message.content,
      }),
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Return more specific error messages
    if (error instanceof Error) {
      // Handle quota and billing errors
      if (error.message.includes('quota') || error.message.includes('billing')) {
        return {
          statusCode: 429,
          body: JSON.stringify({ 
            error: 'OpenAI API quota exceeded. Please check your billing status.',
            details: error.message
          }),
        };
      }
      // Handle API key errors
      if (error.message.includes('API key')) {
        return {
          statusCode: 401,
          body: JSON.stringify({ 
            error: 'Invalid API key',
            details: error.message
          }),
        };
      }
      // Handle rate limit errors
      if (error.message.includes('rate limit')) {
        return {
          statusCode: 429,
          body: JSON.stringify({ 
            error: 'Rate limit exceeded. Please try again later.',
            details: error.message
          }),
        };
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
}; 
