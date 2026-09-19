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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const analyzeQuery = async (query: string): Promise<QueryResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/query`, {
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
