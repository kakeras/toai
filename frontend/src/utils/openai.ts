import OpenAI from 'openai';

export interface OpenAIResponse {
  message: string;
  error?: string;
}

export const callOpenAI = async (messages: OpenAI.Chat.ChatCompletionMessage[]): Promise<OpenAIResponse> => {
  try {
    const response = await fetch('/.netlify/functions/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      message: '',
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}; 