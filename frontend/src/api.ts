export interface RetrievedThread {
  id: number;
  source?: string;
  raw_text: string;
  target_intent?: string;
  search_strategy?: string;
  emotion?: string;
  similarity_score?: number;
}

export interface QuantitativeMetrics {
  remembered_attributes: Record<string, number>;
  forgotten_attributes: Record<string, number>;
}

export interface SynthesizedInsight {
  title: string;
  description: string;
}

export interface EvidenceQuote {
  quote: string;
  source_thread_id?: number;
}

export interface QueryResponse {
  intent: string;
  results: RetrievedThread[];
  metrics: QuantitativeMetrics;
  retrieval_problems?: SynthesizedInsight[];
  opportunity_areas?: SynthesizedInsight[];
  insights?: SynthesizedInsight[];
  evidence: EvidenceQuote[];
}

export const analyzeQuery = async (query: string): Promise<QueryResponse> => {
  // Use relative path so it routes through Vite proxy locally or Render Rewrites in prod
  const response = await fetch('/api/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze query');
  }

  return response.json();
};
