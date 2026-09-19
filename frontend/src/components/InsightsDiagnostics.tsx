import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { analyzeQuery, type QueryResponse } from '../api';

export function InsightsDiagnostics() {
  const location = useLocation();
  const query = location.state?.query || 'What do people actually remember about old travel photos?';
  const initialData = location.state?.data as QueryResponse | undefined;
  
  const [data, setData] = useState<QueryResponse | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);

  const problems = data?.retrieval_problems || data?.insights?.filter(i => !i.title.toLowerCase().includes('opportunity')) || [];
  const opportunities = data?.opportunity_areas || data?.insights?.filter(i => i.title.toLowerCase().includes('opportunity')) || [];

  useEffect(() => {
    if (!initialData) {
      setIsLoading(true);
      analyzeQuery(query)
        .then(setData)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [query, initialData]);

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto px-margin py-space-lg gap-space-lg relative">
      {/* Atmospheric glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-12 right-1/3 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="shrink-0 flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs max-w-3xl">
          <div className="flex items-center gap-space-xs">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">Diagnostic Stream // Synthesis Mode</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-semibold tracking-tight">
            Retrieval Friction Insights
          </h1>
          <div className="flex flex-wrap items-center gap-space-xs text-on-surface-variant font-body-md text-body-md pt-space-xs">
            <span className="material-symbols-outlined text-[18px] text-secondary">psychology_alt</span>
            <span>Query Analysis for:</span>
            <span className="font-label-md text-label-md text-primary px-space-xs py-0.5 rounded bg-surface-container-high shadow-sm">
              “{query}”
            </span>
            <Link className="inline-flex items-center gap-0.5 text-secondary hover:text-primary font-body-sm text-body-sm transition-colors ml-space-xs" to="/">
              <span>Modify Query</span>
              <span className="material-symbols-outlined text-[14px]">north_east</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Section: Memory & Forgotten Information */}
      {data?.metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mt-space-md">
          {/* View 3 - Memory */}
          <div className="flex flex-col gap-space-sm">
            <h2 className="font-headline-md text-headline-md text-on-surface font-medium">
              View 3 — Memory
            </h2>
            <p className="text-on-surface-variant font-body-md mb-2">What information do people remember?</p>
            <div className="bg-surface-container p-space-lg rounded-xl flex flex-col gap-3 relative">
              <button className="absolute top-4 right-4 text-outline hover:text-on-surface transition-colors" title="Copy data">
                <span className="material-symbols-outlined text-[20px]">content_copy</span>
              </button>
              {Object.entries(data.metrics.remembered_attributes || {})
                .sort((a,b) => b[1] - a[1])
                .map(([key, value]) => (
                <div key={key} className="flex justify-start gap-10 items-center">
                  <span className="text-on-surface-variant font-mono text-sm w-24">{key}</span>
                  <span className="text-on-surface font-body-sm font-medium">{value}%</span>
                </div>
              ))}
              {Object.keys(data.metrics.remembered_attributes || {}).length === 0 && (
                <p className="text-on-surface-variant text-sm italic">No data available.</p>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2 border-l-2 border-primary/50 pl-3">
              <p className="text-on-surface-variant font-body-sm italic">
                Multiple attributes may be remembered per retrieval episode.
              </p>
            </div>
          </div>

          {/* View 4 - Forgotten information */}
          <div className="flex flex-col gap-space-sm">
            <h2 className="font-headline-md text-headline-md text-on-surface font-medium">
              View 4 — Forgotten information
            </h2>
            <div className="bg-surface-container p-space-lg rounded-xl flex flex-col gap-3 mt-9 relative">
              <button className="absolute top-4 right-4 text-outline hover:text-on-surface transition-colors" title="Copy data">
                <span className="material-symbols-outlined text-[20px]">content_copy</span>
              </button>
              {Object.entries(data.metrics.forgotten_attributes || {})
                .sort((a,b) => b[1] - a[1])
                .map(([key, value]) => (
                <div key={key} className="flex justify-start gap-10 items-center">
                  <span className="text-on-surface-variant font-mono text-sm w-32">{key}</span>
                  <span className="text-on-surface font-body-sm font-medium">{value}%</span>
                </div>
              ))}
              {Object.keys(data.metrics.forgotten_attributes || {}).length === 0 && (
                <p className="text-on-surface-variant text-sm italic">No data available.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Synthesis & Evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mt-space-md">
        {/* Left Panel: Problems vs Opportunities */}
        <div className="lg:col-span-7 flex flex-col gap-space-lg">
          
          {/* Retrieval Problems */}
          <div className="bg-surface-container p-space-lg rounded-xl shadow-xl border-l-4 border-error/70 flex flex-col gap-space-md">
            <h2 className="font-headline-md text-headline-md text-error font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">warning</span>
              Identified Retrieval Problems
            </h2>
            <div className="flex flex-col gap-space-sm">
              {problems.length ? (
                problems.map((insight, idx) => (
                  <div key={`prob-${idx}`} className="bg-error/5 p-space-md rounded-lg border border-error/10 hover:border-error/30 transition-colors">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-1">
                      {insight.title.replace(/retrieval problem:\s*/i, '').trim()}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-on-surface-variant text-sm italic">{isLoading ? 'Analyzing...' : 'No problems identified.'}</p>
              )}
            </div>
          </div>

          {/* Opportunity Areas */}
          <div className="bg-surface-container p-space-lg rounded-xl shadow-xl border-l-4 border-primary/70 flex flex-col gap-space-md">
            <h2 className="font-headline-md text-headline-md text-primary font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">lightbulb</span>
              Opportunity Areas
            </h2>
            <div className="flex flex-col gap-space-sm">
              {opportunities.length ? (
                opportunities.map((insight, idx) => (
                  <div key={`opp-${idx}`} className="bg-primary/5 p-space-md rounded-lg border border-primary/10 hover:border-primary/30 transition-colors">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-1">
                      {insight.title.replace(/opportunity area:\s*/i, '').trim()}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-on-surface-variant text-sm italic">{isLoading ? 'Analyzing...' : 'No opportunities identified.'}</p>
              )}
            </div>
          </div>

        </div>

        {/* Right Panel: Voice of the User */}
        <div className="lg:col-span-5 bg-surface-container p-space-lg rounded-xl shadow-xl flex flex-col">
          <div className="flex flex-col gap-space-md mb-space-md">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-tertiary">record_voice_over</span>
                Voice of the User
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Direct evidence extracted from public platforms to support the synthesis.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-space-md overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-[600px]">
            {data?.evidence?.length ? data.evidence.map((item, idx) => (
              <div key={idx} className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant hover:shadow-md transition-shadow relative">
                <div className="absolute top-2 left-2 text-tertiary/20">
                  <span className="material-symbols-outlined text-3xl">format_quote</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface italic pl-6 relative z-10 leading-relaxed">
                  “{typeof item === 'string' ? item : item.quote}”
                </p>
              </div>
            )) : (
              <div className="bg-surface-container-lowest p-space-md rounded-xl text-center py-10">
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {isLoading ? 'Retrieving user evidence...' : 'No user quotes extracted for this query.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}