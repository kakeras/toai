import type { ChatCompletionMessage } from 'openai/resources/chat';

interface OpenAIResponse {
  content: string;
  role: string;
}

export async function callOpenAI(messages: ChatCompletionMessage[], model?: string): Promise<OpenAIResponse> {
  try {
    const response = await fetch('/.netlify/functions/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get response from OpenAI');
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
} 