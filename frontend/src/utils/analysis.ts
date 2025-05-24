import { callOpenAIV2 } from './openai';
// import { callOpenAI, callOpenAIV2 } from './openai';
import type { Message } from '../types/jibun';
import type { Message as PortfolioMessage } from '../types/portfolio';
import type OpenAI from 'openai';

// const ANALYSIS_PROMPT = `Based on the conversation above, please provide a brief analysis and career advice in Japanese within 100 words. Focus on:
// 1. Key strengths and patterns identified
// 2. Areas for potential growth
// 3. Specific actionable advice
// Keep the tone encouraging and constructive.`;

const ANALYSIS_PROMPT_V2 = `上記の会話に基づいて、100文字以内で簡潔な分析とキャリアアドバイスを提供してください。以下の点に焦点を当ててください：
1. 特定された主要な強みとパターン
2. 成長が期待できる分野
3. 具体的で実行可能なアドバイス
励ましと建設的な tone を保ってください。`;

export const analyzeConversation = async (messages: Message[] | PortfolioMessage[]) => {
  const conversationText = messages
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');

  // const promptV1 = `${conversationText}\n\n${ANALYSIS_PROMPT}`;
  const promptV2 = `${conversationText}\n\n${ANALYSIS_PROMPT_V2}`;

  // const response = await callOpenAI([
  //   { role: 'assistant', content: promptV1 } as OpenAI.Chat.ChatCompletionMessage
  // ]);
  const response = await callOpenAIV2([
    { role: 'assistant', content: promptV2 } as OpenAI.Chat.ChatCompletionMessage
  ]);

  return response;
}; 