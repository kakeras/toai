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
  "理想（やりたいこと）": string;
  "現状": string;
  "ギャップ（差）": string;
  "NextAction（優先順位付き）": string;
}

export interface JibunData {
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