export interface Character {
  name: string;
  personality: string;
}

export interface ConversationItem {
  phase: string;
  question: string;
  answer: string;
}

export interface Summary {
  "Mission（人生の目的）": string;
  "Value（大切にしていること）": string;
  "Vision（未来像）": string;
  "気づき・内省": string;
}

export interface PortfolioData {
  sessionId: string;
  character: Character;
  conversation: ConversationItem[];
  summary: Summary;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  phase?: string;
} 