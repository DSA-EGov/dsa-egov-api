export interface AiResponse {
  answers: AiAnswer[];
}

export interface AiAnswer {
  questions: string[];
  answer: string;
  confidenceScore: number;
  id: number;
  source: string;
  metadata: {
    system_metadata_qna_edited_manually: boolean;
  };
  dialog: {
    isContextOnly: boolean;
    prompts: any[];
  };
}

export interface AiQuestion {
  top: number;
  question: string;
}

export interface AiQueryAnswer {
  userId: string;
  text: string;
  sessionId: string;
}
