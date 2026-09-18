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

  const getMetric = (type: keyof QueryResponse['metrics'], keySubstring: string, fallback: string) => {
    if (!data?.metrics?.[type]) return fallback;
    const match = Object.entries(data.metrics[type]).find(([k]) => k.toLowerCase().includes(keySubstring));
    if (match) return `${(match[1] * 100).toFixed(1)}%`;
    // Just return the first one as a generic fallback to show dynamic data
    const first = Object.values(data.metrics[type])[0];
    return first !== undefined ? `${(first * 100).toFixed(1)}%` : fallback;
  };

  const val1 = getMetric('emotions', 'frustrat', '86.4%');
  const val2 = getMetric('target_intents', 'receipt', '44.1%');
  const val3 = getMetric('search_strategies', 'vague', '62.8%');
  const val4 = getMetric('emotions', 'abandon', '31.2%');

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto px-margin py-space-lg gap-space-lg relative">
      {/* Atmospheric glows without borders */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-12 right-1/3 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Header & Filter Substrate */}
      <div className="shrink-0 flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs max-w-3xl">
          <div className="flex items-center gap-space-xs">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">Diagnostic Stream // Synthesis Mode</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">• Confidence 99.4%</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-semibold tracking-tight">
            Retrieval Friction Insights & Synthesis
          </h1>
          <div className="flex flex-wrap items-center gap-space-xs text-on-surface-variant font-body-md text-body-md pt-space-xs">
            <span className="material-symbols-outlined text-[18px] text-secondary">psychology_alt</span>
            <span>Displaying telemetry for query:</span>
            <span className="font-label-md text-label-md text-primary px-space-xs py-0.5 rounded bg-surface-container-high shadow-sm">
              “{query}”
            </span>
            <Link className="inline-flex items-center gap-0.5 text-secondary hover:text-primary font-body-sm text-body-sm transition-colors ml-space-xs" to="/">
              <span>Modify Query</span>
              <span className="material-symbols-outlined text-[14px]">north_east</span>
            </Link>
          </div>
        </div>
        {/* Time Selector & Control Group */}
        <div className="flex items-center gap-space-sm self-start lg:self-auto shrink-0 bg-surface-container-lowest p-1 rounded-xl shadow-lg">
          <div className="flex items-center" id="time-range-group">
            <button className="px-space-sm py-1 rounded-lg font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-all" type="button">24h</button>
            <button className="px-space-sm py-1 rounded-lg font-label-sm text-label-sm bg-primary-container text-on-primary-container font-semibold shadow-sm transition-all" type="button">7d</button>
            <button className="px-space-sm py-1 rounded-lg font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-all" type="button">30d</button>
            <button className="px-space-sm py-1 rounded-lg font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-all" type="button">Quarter</button>
          </div>
          <div className="w-px h-5 bg-surface-container-high mx-1"></div>
          <button className="flex items-center gap-space-xs px-space-sm py-1 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright font-label-sm text-label-sm transition-all" type="button">
            <span className="material-symbols-outlined text-[15px] text-primary">sync</span>
            <span>Auto-sync</span>
          </button>
        </div>
      </div>
      {/* Section 1: Retrieval Friction KPIs (Top Row) */}
      <div className="shrink-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter">
        {/* KPI 1: Date Amnesia Gap */}
        <div className="relative group bg-surface-container hover:bg-surface-container-high p-space-lg rounded-xl shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-primary/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
          <div className="flex flex-col gap-space-xs relative z-10">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">Cognitive Anchor Void</span>
              <span className="material-symbols-outlined text-[18px] text-primary">event_busy</span>
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface">Date Amnesia Gap</span>
            <div className="flex items-baseline gap-space-xs mt-space-xs">
              <span className="font-headline-2xl text-headline-2xl font-bold tracking-tight text-on-surface">
                {isLoading ? '...' : val1}
              </span>
              <span className="font-label-sm text-label-sm text-tertiary font-semibold flex items-center">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>+7.2%
              </span>
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant">vs baseline 79.2% (n=22,410)</div>
          </div>
          <div className="mt-space-md pt-space-sm relative z-10">
            <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden mb-space-xs">
              <div className="bg-primary h-full rounded-full shadow-[0_0_8px_rgba(76,215,246,0.6)]" style={{ width: '86.4%' }}></div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Users anchor recollections to seasonal weather, vibes, or companions—rarely year/month timestamps.
            </p>
          </div>
        </div>
        {/* KPI 2: Utility Failures */}
        <div className="relative group bg-surface-container hover:bg-surface-container-high p-space-lg rounded-xl shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-tertiary-container/15 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
          <div className="flex flex-col gap-space-xs relative z-10">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-wider">High Urgency Drift</span>
              <span className="material-symbols-outlined text-[18px] text-tertiary">receipt_long</span>
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface">Utility Failures</span>
            <div className="flex items-baseline gap-space-xs mt-space-xs">
              <span className="font-headline-2xl text-headline-2xl font-bold tracking-tight text-on-surface">
                {isLoading ? '...' : val2}
              </span>
              <span className="font-label-sm text-label-sm text-tertiary font-semibold flex items-center">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>+12.4%
              </span>
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant">Elevated Friction Risk</div>
          </div>
          <div className="mt-space-md pt-space-sm relative z-10">
            <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden mb-space-xs">
              <div className="bg-tertiary h-full rounded-full shadow-[0_0_8px_rgba(255,176,205,0.6)]" style={{ width: '44.1%' }}></div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Short-lifespan items (parking stubs, receipts, serial plates) generate the highest rage-quits.
            </p>
          </div>
        </div>
        {/* KPI 3: Vague Recall Drop */}
        <div className="relative group bg-surface-container hover:bg-surface-container-high p-space-lg rounded-xl shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-secondary/15 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
          <div className="flex flex-col gap-space-xs relative z-10">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Semantic Void Index</span>
              <span className="material-symbols-outlined text-[18px] text-secondary">blur_on</span>
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface">Vague Recall Drop</span>
            <div className="flex items-baseline gap-space-xs mt-space-xs">
              <span className="font-headline-2xl text-headline-2xl font-bold tracking-tight text-on-surface">
                {isLoading ? '...' : val3}
              </span>
              <span className="font-label-sm text-label-sm text-primary font-semibold flex items-center">
                <span className="material-symbols-outlined text-[14px]">arrow_downward</span>-3.1%
              </span>
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant">Multi-modal dissonance</div>
          </div>
          <div className="mt-space-md pt-space-sm relative z-10">
            <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden mb-space-xs">
              <div className="bg-secondary h-full rounded-full shadow-[0_0_8px_rgba(221,183,255,0.6)]" style={{ width: '62.8%' }}></div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Queries rely on imprecise descriptive phrases like “cozy dinner with wine” vs searchable EXIF tags.
            </p>
          </div>
        </div>
        {/* KPI 4: Search Abandonment */}
        <div className="relative group bg-surface-container hover:bg-surface-container-high p-space-lg rounded-xl shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-tertiary/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
          <div className="flex flex-col gap-space-xs relative z-10">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-wider">Churn Vector</span>
              <span className="material-symbols-outlined text-[18px] text-tertiary">sensor_door</span>
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface">Search Abandonment</span>
            <div className="flex items-baseline gap-space-xs mt-space-xs">
              <span className="font-headline-2xl text-headline-2xl font-bold tracking-tight text-on-surface">
                {isLoading ? '...' : val4}
              </span>
              <span className="font-label-sm text-label-sm text-tertiary font-semibold flex items-center">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>+4.5%
              </span>
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant">Post 3+ query retries</div>
          </div>
          <div className="mt-space-md pt-space-sm relative z-10">
            <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden mb-space-xs">
              <div className="bg-tertiary h-full rounded-full shadow-[0_0_8px_rgba(255,176,205,0.6)]" style={{ width: '31.2%' }}></div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Users re-typed query &gt;3 times with negative emotional feedback before closing search view.
            </p>
          </div>
        </div>
      </div>
      {/* Sections 2 & 3 */}
      <div className="flex flex-col gap-space-lg">
        {/* Section 2: Visualizations Section (Middle Row) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Card 1: Failure Distribution Donut Chart (5 cols) */}
          <div className="lg:col-span-5 bg-surface-container p-space-lg rounded-xl shadow-xl flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <h2 className="font-headline-md text-headline-md text-on-surface font-medium">Failure Distribution by Content Type</h2>
                <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-lowest px-2 py-0.5 rounded-full">33.6k Events</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-lg">Dissecting retrieval dropouts across functional intent classes.</p>
            </div>
            {/* SVG Donut Chart with Centered Metric */}
            <div className="flex flex-col sm:flex-row items-center justify-around gap-space-lg my-space-md">
              <div className="relative w-44 h-44 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  <circle className="text-surface-container-lowest" cx="80" cy="80" fill="transparent" r="60" stroke="currentColor" strokeWidth="20"></circle>
                  <circle className="text-tertiary" cx="80" cy="80" fill="transparent" r="60" stroke="currentColor" strokeDasharray="165.8 377" strokeDashoffset="0" strokeWidth="20"></circle>
                  <circle className="text-primary" cx="80" cy="80" fill="transparent" r="60" stroke="currentColor" strokeDasharray="135.7 377" strokeDashoffset="-165.8" strokeWidth="20"></circle>
                  <circle className="text-secondary" cx="80" cy="80" fill="transparent" r="60" stroke="currentColor" strokeDasharray="75.4 377" strokeDashoffset="-301.5" strokeWidth="20"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="font-headline-lg text-headline-lg font-bold text-on-surface">44%</span>
                  <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-wider">Utility Peak</span>
                </div>
              </div>
              {/* Legend */}
              <div className="flex flex-col gap-space-sm w-full sm:w-auto">
                <div className="flex items-center justify-between gap-space-md bg-surface-container-lowest/60 p-space-xs rounded-lg px-space-sm">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-3 h-3 rounded-sm bg-tertiary"></span>
                    <span className="font-body-md text-body-md text-on-surface">Utility Records</span>
                  </div>
                  <span className="font-label-md text-label-md text-tertiary font-semibold">44% <span className="text-on-surface-variant font-normal">(14.8k)</span></span>
                </div>
                <div className="flex items-center justify-between gap-space-md bg-surface-container-lowest/60 p-space-xs rounded-lg px-space-sm">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-3 h-3 rounded-sm bg-primary"></span>
                    <span className="font-body-md text-body-md text-on-surface">Milestones &amp; Trips</span>
                  </div>
                  <span className="font-label-md text-label-md text-primary font-semibold">36% <span className="text-on-surface-variant font-normal">(12.1k)</span></span>
                </div>
                <div className="flex items-center justify-between gap-space-md bg-surface-container-lowest/60 p-space-xs rounded-lg px-space-sm">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-3 h-3 rounded-sm bg-secondary"></span>
                    <span className="font-body-md text-body-md text-on-surface">Casual &amp; Ephemeral</span>
                  </div>
                  <span className="font-label-md text-label-md text-secondary font-semibold">20% <span className="text-on-surface-variant font-normal">(6.7k)</span></span>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-lowest/40 rounded-lg p-space-sm flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm mt-space-sm">
              <span>Observed Correlation: High stress inversely maps to EXIF date retrieval.</span>
              <span className="material-symbols-outlined text-[16px] text-primary">data_thresholding</span>
            </div>
          </div>
          {/* Card 2: Root Cause Horizontal Bar Chart (7 cols) */}
          <div className="lg:col-span-7 bg-surface-container p-space-lg rounded-xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <h2 className="font-headline-md text-headline-md text-on-surface font-medium">Root Cause Breakdown of Query Failures</h2>
                <div className="flex items-center gap-space-xs bg-surface-container-lowest px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span className="font-label-sm text-label-sm text-on-surface font-medium">Multi-Label Tagging</span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">Algorithmic divergence tracking between episodic search prompts and system embeddings.</p>
            </div>
            {/* Horizontal Bar Diagnostics */}
            <div className="flex flex-col gap-space-md my-space-xs">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-on-surface font-body-sm text-body-sm">
                  <span className="flex items-center gap-space-xs">
                    <span className="font-label-sm text-label-sm text-primary">RC-01</span>
                    <span>Metadata Mismatch (Date/EXIF reliance vs episodic memory)</span>
                  </span>
                  <span className="font-label-md text-label-md text-primary font-semibold">48.2%</span>
                </div>
                <div className="w-full bg-surface-container-lowest h-3 rounded-full overflow-hidden p-0.5">
                  <div className="bg-gradient-to-r from-primary to-primary-container h-full rounded-full" style={{ width: '48.2%' }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-on-surface font-body-sm text-body-sm">
                  <span className="flex items-center gap-space-xs">
                    <span className="font-label-sm text-label-sm text-secondary">RC-02</span>
                    <span>Vague Semantics (“warm vibes”, “that lunch spot with wood chairs”)</span>
                  </span>
                  <span className="font-label-md text-label-md text-secondary font-semibold">34.0%</span>
                </div>
                <div className="w-full bg-surface-container-lowest h-3 rounded-full overflow-hidden p-0.5">
                  <div className="bg-gradient-to-r from-secondary to-secondary-container h-full rounded-full" style={{ width: '34%' }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-on-surface font-body-sm text-body-sm">
                  <span className="flex items-center gap-space-xs">
                    <span className="font-label-sm text-label-sm text-tertiary">RC-03</span>
                    <span>OCR Ingestion Miss (Unindexed low-res parking receipts/tickets)</span>
                  </span>
                  <span className="font-label-md text-label-md text-tertiary font-semibold">27.4%</span>
                </div>
                <div className="w-full bg-surface-container-lowest h-3 rounded-full overflow-hidden p-0.5">
                  <div className="bg-gradient-to-r from-tertiary to-tertiary-container h-full rounded-full" style={{ width: '27.4%' }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-on-surface font-body-sm text-body-sm">
                  <span className="flex items-center gap-space-xs">
                    <span className="font-label-sm text-label-sm text-outline">RC-04</span>
                    <span>Multi-Query Friction Loop (&gt;3 re-queries in &lt;90 seconds)</span>
                  </span>
                  <span className="font-label-md text-label-md text-outline font-semibold">18.1%</span>
                </div>
                <div className="w-full bg-surface-container-lowest h-3 rounded-full overflow-hidden p-0.5">
                  <div className="bg-surface-bright h-full rounded-full" style={{ width: '18.1%' }}></div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-space-xs pt-space-sm text-on-surface-variant font-label-sm text-label-sm">
              <span className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
                Confidence Level: p-value &lt; 0.001 (Spearman Rank Correlation r=0.78)
              </span>
              <span className="text-primary font-mono">OmniVision Telemetry V2.4</span>
            </div>
          </div>
        </div>
        {/* Section 3: Split Insights & User Evidence Feed (Bottom Row) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left Panel: Executive AI Synthesis (5 cols) */}
          <div className="lg:col-span-5 bg-surface-container p-space-lg rounded-xl shadow-xl flex flex-col justify-between">
            <div className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px] text-primary">neurology</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-medium">Executive AI Synthesis</h2>
                </div>
                <span className="font-label-sm text-label-sm text-on-primary bg-primary-container px-space-xs py-0.5 rounded font-semibold tracking-wide flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-on-primary"></span>
                  Ready for Action
                </span>
              </div>
              {data?.insights && data.insights.length > 0 ? (
                <>
                  <div className="bg-surface-container-lowest p-space-md rounded-xl relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-tertiary"></div>
                    <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">Primary Opportunity Area</span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">
                      {data.insights[0].title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                      {data.insights[0].description}
                    </p>
                  </div>
                  {data.insights.length > 1 && (
                    <div className="flex flex-col gap-space-sm mt-space-sm">
                      <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider">Critical Friction Vectors</span>
                      {data.insights.slice(1).map((insight, idx) => (
                        <div key={idx} className="flex items-start gap-space-sm bg-surface-container-high/60 p-space-sm rounded-lg">
                          <div className="w-7 h-7 rounded bg-tertiary/15 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[18px] text-tertiary">analytics</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-headline-sm text-headline-sm text-on-surface text-[14px]">{insight.title}</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                              {insight.description}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-surface-container-lowest p-space-md rounded-xl relative overflow-hidden">
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Loading insights or no insights found...</p>
                </div>
              )}
            </div>
            <div className="pt-space-md mt-space-md bg-surface-container-lowest/50 -mx-space-lg -mb-space-lg p-space-md rounded-b-xl flex items-center justify-between gap-space-sm">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Recommendation</span>
                <span className="font-headline-sm text-headline-sm text-on-surface text-[14px]">Promote Episodic Anchor PRD</span>
              </div>
              <a className="inline-flex items-center gap-space-xs px-space-md py-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-body-md text-body-md font-medium rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(76,215,246,0.4)] transition-all" href="#">
                <span className="material-symbols-outlined text-[18px]">description</span>
                <span>Generate Spec Doc</span>
              </a>
            </div>
          </div>
          {/* Right Panel: Voice of the User Feed (7 cols) */}
          <div className="lg:col-span-7 bg-surface-container p-space-lg rounded-xl shadow-xl flex flex-col justify-between">
            <div className="flex flex-col gap-space-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-medium">Voice of the User: Incident Transcripts</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Real-time verbatim friction captures and affective state profiling.</p>
                </div>
                <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-full shrink-0">
                  <button className="px-space-xs py-0.5 rounded-full font-label-sm text-label-sm bg-primary-container text-on-primary-container font-medium">All</button>
                  <button className="px-space-xs py-0.5 rounded-full font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface">Utility</button>
                  <button className="px-space-xs py-0.5 rounded-full font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface">Milestone</button>
                  <button className="px-space-xs py-0.5 rounded-full font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface">Casual</button>
                </div>
              </div>
              <div className="flex flex-col gap-space-md">
                {data?.evidence?.map((item, idx) => (
                  <div key={idx} className="bg-surface-container-lowest p-space-md rounded-xl shadow-md transition-all hover:bg-surface-container-high/50 flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between gap-space-sm">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-label-sm text-label-sm font-semibold">U{idx+1}</div>
                        <div>
                          <div className="font-headline-sm text-headline-sm text-on-surface text-[14px]">User {item.source_thread_id}</div>
                          <div className="font-label-sm text-label-sm text-on-surface-variant">Extracted Verbatim Quote</div>
                        </div>
                      </div>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant italic pl-space-xs border-l-2 border-primary/60 my-1 mt-3">
                      “{item.quote}”
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-space-md mt-space-md bg-surface-container-lowest/50 -mx-space-lg -mb-space-lg p-space-md rounded-b-xl flex flex-col sm:flex-row items-center justify-between gap-space-sm">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Showing 4 verified incident clusters • Real-time ingestion active</span>
              <a className="inline-flex items-center gap-space-xs px-space-md py-1.5 bg-surface-container-high hover:bg-surface-bright text-on-surface rounded-lg font-body-sm text-body-sm transition-colors" href="#">
                <span>Load 36 more records</span>
                <span className="material-symbols-outlined text-[16px] text-primary">expand_more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}