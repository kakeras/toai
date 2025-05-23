import { callOpenAI } from './openai';
import type { Message } from '../types/jibun';
import type { Message as PortfolioMessage } from '../types/portfolio';
import type OpenAI from 'openai';

const ANALYSIS_PROMPT = `Based on the conversation above, please provide a brief analysis and career advice in Japanese within 100 words. Focus on:
1. Key strengths and patterns identified
2. Areas for potential growth
3. Specific actionable advice
Keep the tone encouraging and constructive.`;

export const analyzeConversation = async (messages: Message[] | PortfolioMessage[]) => {
  const conversationText = messages
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');

  const prompt = `${conversationText}\n\n${ANALYSIS_PROMPT}`;

  const response = await callOpenAI([
    { role: 'assistant', content: prompt } as OpenAI.Chat.ChatCompletionMessage
  ]);

  return response;
}; 