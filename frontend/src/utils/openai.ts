import OpenAI from 'openai';
import { toast } from 'react-toastify';

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
      const errorData = await response.json();
      const errorMessage = errorData.error || 'An error occurred';
      
      // Show error toast
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });

      throw new Error(errorMessage);
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