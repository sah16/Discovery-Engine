import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { analyzeQuery, type QueryResponse } from '../api';

export function InsightsDiagnostics() {
  const location = useLocation();
  const query = location.state?.query || 'What do people actually remember about old travel photos?';
  const initialData = location.state?.data as QueryResponse | undefined;
  
  const [data, setData] = useState<QueryResponse | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);

  useEffect(() => {
    if (!initialData) {
      setIsLoading(true);
      analyzeQuery(query)
        .then(setData)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [query, initialData]);

  // Helper to extract sorted metrics safely
  const getSortedMetrics = (type: keyof QueryResponse['metrics']) => {
    if (!data?.metrics?.[type]) return [];
    return Object.entries(data.metrics[type]).sort((a, b) => b[1] - a[1]);
  };

  const getTopMetric = (type: keyof QueryResponse['metrics'], index: number, fallback: string) => {
    const sorted = getSortedMetrics(type);
    if (index < sorted.length) {
      return { label: sorted[index][0], value: sorted[index][1], formatted: `${sorted[index][1].toFixed(1)}%` };
    }
    return { label: fallback, value: 0, formatted: '0.0%' };
  };

  const kpi1 = getTopMetric('target_intents', 0, 'Target Intent');
  const kpi2 = getTopMetric('search_strategies', 0, 'Search Strategy');
  const kpi3 = getTopMetric('emotions', 0, 'Primary Emotion');
  const kpi4 = getTopMetric('emotions', 1, 'Secondary Emotion');

  const intentsList = getSortedMetrics('target_intents').slice(0, 4);
  const strategiesList = getSortedMetrics('search_strategies').slice(0, 4);

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

      {/* Section 1: Top 4 KPIs */}
      <div className="shrink-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter">
        {/* KPI 1 */}
        <div className="bg-surface-container p-space-lg rounded-xl shadow-xl flex flex-col justify-between">
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">Top Target Intent</span>
            <span className="font-headline-sm text-headline-sm text-on-surface truncate">{kpi1.label}</span>
            <span className="font-headline-2xl text-headline-2xl font-bold tracking-tight text-on-surface mt-space-xs">
              {isLoading ? '...' : kpi1.formatted}
            </span>
          </div>
          <div className="mt-space-md pt-space-sm">
            <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: kpi1.formatted }}></div>
            </div>
          </div>
        </div>
        {/* KPI 2 */}
        <div className="bg-surface-container p-space-lg rounded-xl shadow-xl flex flex-col justify-between">
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-wider">Primary Strategy</span>
            <span className="font-headline-sm text-headline-sm text-on-surface truncate">{kpi2.label}</span>
            <span className="font-headline-2xl text-headline-2xl font-bold tracking-tight text-on-surface mt-space-xs">
              {isLoading ? '...' : kpi2.formatted}
            </span>
          </div>
          <div className="mt-space-md pt-space-sm">
            <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
              <div className="bg-tertiary h-full rounded-full" style={{ width: kpi2.formatted }}></div>
            </div>
          </div>
        </div>
        {/* KPI 3 */}
        <div className="bg-surface-container p-space-lg rounded-xl shadow-xl flex flex-col justify-between">
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Dominant Emotion</span>
            <span className="font-headline-sm text-headline-sm text-on-surface truncate">{kpi3.label}</span>
            <span className="font-headline-2xl text-headline-2xl font-bold tracking-tight text-on-surface mt-space-xs">
              {isLoading ? '...' : kpi3.formatted}
            </span>
          </div>
          <div className="mt-space-md pt-space-sm">
            <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: kpi3.formatted }}></div>
            </div>
          </div>
        </div>
        {/* KPI 4 */}
        <div className="bg-surface-container p-space-lg rounded-xl shadow-xl flex flex-col justify-between">
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Secondary Emotion</span>
            <span className="font-headline-sm text-headline-sm text-on-surface truncate">{kpi4.label}</span>
            <span className="font-headline-2xl text-headline-2xl font-bold tracking-tight text-on-surface mt-space-xs">
              {isLoading ? '...' : kpi4.formatted}
            </span>
          </div>
          <div className="mt-space-md pt-space-sm">
            <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
              <div className="bg-surface-bright h-full rounded-full" style={{ width: kpi4.formatted }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Distribution Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        {/* Intents Breakdown */}
        <div className="bg-surface-container p-space-lg rounded-xl shadow-xl flex flex-col">
          <h2 className="font-headline-md text-headline-md text-on-surface font-medium mb-space-xs">Failure Distribution by Content Type</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-lg">What users were attempting to find.</p>
          
          <div className="flex flex-col gap-space-md flex-1">
            {intentsList.length === 0 && !isLoading && (
              <p className="text-on-surface-variant text-sm">No data available.</p>
            )}
            {intentsList.map(([label, value], idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-on-surface font-body-sm text-body-sm">
                  <span className="font-label-sm text-label-sm">{label}</span>
                  <span className="font-label-md text-label-md font-semibold text-primary">{value.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-surface-container-lowest h-3 rounded-full overflow-hidden p-0.5">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategies Breakdown */}
        <div className="bg-surface-container p-space-lg rounded-xl shadow-xl flex flex-col">
          <h2 className="font-headline-md text-headline-md text-on-surface font-medium mb-space-xs">Breakdown of Search Strategies</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-lg">How users attempted to find their photos.</p>
          
          <div className="flex flex-col gap-space-md flex-1">
            {strategiesList.length === 0 && !isLoading && (
              <p className="text-on-surface-variant text-sm">No data available.</p>
            )}
            {strategiesList.map(([label, value], idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-on-surface font-body-sm text-body-sm">
                  <span className="font-label-sm text-label-sm">{label}</span>
                  <span className="font-label-md text-label-md font-semibold text-secondary">{value.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-surface-container-lowest h-3 rounded-full overflow-hidden p-0.5">
                  <div className="bg-secondary h-full rounded-full" style={{ width: `${value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Split Insights & User Evidence Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Panel: Executive AI Synthesis (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container p-space-lg rounded-xl shadow-xl flex flex-col justify-between">
          <div className="flex flex-col gap-space-md">
            <h2 className="font-headline-md text-headline-md text-on-surface font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">neurology</span>
              Executive AI Synthesis
            </h2>
            
            {data?.insights && data.insights.length > 0 ? (
              <div className="flex flex-col gap-space-sm mt-space-sm">
                {data.insights.map((insight, idx) => (
                  <div key={idx} className="bg-surface-container-lowest p-space-md rounded-xl relative overflow-hidden">
                    {idx === 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-tertiary"></div>}
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-2 text-[15px]">
                      {insight.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface-container-lowest p-space-md rounded-xl">
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {isLoading ? 'Synthesizing insights from retrieval database...' : 'No insights found.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Voice of the User Feed (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container p-space-lg rounded-xl shadow-xl flex flex-col justify-between">
          <div className="flex flex-col gap-space-md">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-medium">Voice of the User: Extracted Evidence</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Real-time verbatim friction captures from public platforms.</p>
            </div>
            
            <div className="flex flex-col gap-space-md">
              {data?.evidence?.length ? data.evidence.map((item, idx) => (
                <div key={idx} className="bg-surface-container-lowest p-space-md rounded-xl shadow-md flex flex-col gap-space-xs">
                  <p className="font-body-md text-body-md text-on-surface-variant italic pl-space-md border-l-2 border-primary/60">
                    “{item.quote}”
                  </p>
                </div>
              )) : (
                <div className="bg-surface-container-lowest p-space-md rounded-xl">
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {isLoading ? 'Retrieving user evidence...' : 'No user quotes extracted for this query.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}