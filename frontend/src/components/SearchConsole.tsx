import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export function SearchConsole() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchWithQuery = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Navigate to insights page immediately with query in state
      navigate('/insights', { state: { query: searchQuery } });
    }
  };

  const handleSearch = () => handleSearchWithQuery(query);

  const handleQuickPill = (text: string) => {
    setQuery(text);
  };

  const handleCardClick = (searchQuery: string) => {
    setQuery(searchQuery);
    handleSearchWithQuery(searchQuery);
  };

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto">
      <section className="relative w-full overflow-hidden px-margin py-space-xl flex flex-col items-center shrink-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[760px] h-[380px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-28 left-1/3 -translate-x-1/2 w-[460px] h-[280px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-52 right-1/4 w-[340px] h-[240px] bg-tertiary-container/10 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-5xl flex flex-col items-center text-center mt-12">

          <h1 className="font-headline-2xl text-headline-2xl text-on-surface tracking-tight max-w-4xl mx-auto leading-tight">
            Analyze Photo Retrieval <span className="bg-gradient-to-r from-primary via-secondary to-tertiary-fixed bg-clip-text text-transparent">Failure Modes</span>
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-space-md mb-space-xl">
            Uncover how people remember old visual information and where existing retrieval experiences break down.
          </p>

          <div className="w-full relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/30 blur-xl opacity-60 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
            <div className="relative w-full rounded-2xl bg-surface-container/75 backdrop-blur-2xl p-space-sm shadow-2xl shadow-black/60 flex flex-col md:flex-row items-center gap-space-sm">
              <div className="pl-space-md text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px]">travel_explore</span>
              </div>

              <div className="relative flex-1 w-full">
                <input
                  className="w-full bg-transparent px-space-sm py-space-md text-on-surface font-headline-sm text-headline-sm focus:outline-none placeholder:text-outline placeholder:font-body-md"
                  placeholder="What information do people actually remember about a photo?"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                {query && (
                  <button
                    aria-label="Clear query"
                    className="absolute right-space-sm top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface-variant transition-colors p-1"
                    type="button"
                    onClick={() => setQuery('')}
                  >
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-space-sm w-full md:w-auto shrink-0 justify-end">
                <button
                  className="w-full md:w-auto px-space-lg py-space-md rounded-xl bg-gradient-to-r from-primary-container via-secondary-container to-tertiary-container hover:brightness-110 active:scale-95 text-on-primary font-headline-sm text-headline-sm font-semibold flex items-center justify-center gap-space-sm shadow-lg shadow-primary-container/20 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  type="button"
                  onClick={handleSearch}
                  disabled={!query.trim()}
                >
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                  <span>Analyze & Synthesize</span>
                </button>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-wrap items-center justify-center gap-space-sm mt-space-lg">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider mr-space-xs">Quick Seed Prompts:</span>

            <button onClick={() => handleQuickPill('What kinds of old photos do users struggle to retrieve?')} className="quick-pill rounded-full px-space-md py-1.5 bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md transition-all duration-150 flex items-center gap-space-xs group shadow-sm" type="button">
              <span className="material-symbols-outlined text-[14px] text-primary group-hover:rotate-12 transition-transform">photo_library</span>
              <span>Retrieval Struggles</span>
            </button>
            <button onClick={() => handleQuickPill('What information do people actually remember about a photo?')} className="quick-pill rounded-full px-space-md py-1.5 bg-surface-container hover:bg-surface-container-high text-secondary font-label-md text-label-md transition-all duration-150 flex items-center gap-space-xs group shadow-sm" type="button">
              <span className="material-symbols-outlined text-[14px] text-secondary group-hover:rotate-12 transition-transform">psychology</span>
              <span>Memory Reliability</span>
            </button>
            <button onClick={() => handleQuickPill('How do users formulate searches when their memory is incomplete?')} className="quick-pill rounded-full px-space-md py-1.5 bg-surface-container hover:bg-surface-container-high text-tertiary-fixed font-label-md text-label-md transition-all duration-150 flex items-center gap-space-xs group shadow-sm" type="button">
              <span className="material-symbols-outlined text-[14px] text-tertiary-fixed group-hover:rotate-12 transition-transform">manage_search</span>
              <span>Search Formulation</span>
            </button>
            <button onClick={() => handleQuickPill('Does Google Photos fail to understand the clues they provide?')} className="quick-pill rounded-full px-space-md py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all duration-150 flex items-center gap-space-xs group shadow-sm" type="button">
              <span className="material-symbols-outlined text-[14px] text-outline group-hover:text-primary transition-colors">report_problem</span>
              <span>Search Breakdowns</span>
            </button>
          </div>

          <div className="w-full mt-space-xl p-space-sm rounded-xl bg-surface-container-lowest/80 backdrop-blur-md shadow-inner flex flex-wrap items-center justify-center gap-x-space-md gap-y-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[14px] text-primary">hub</span>
              <span>Indexed Public Discourse (App Stores, Reddit, Forums, YouTube)</span>
            </div>
            <span className="text-outline-variant hidden sm:inline">•</span>
            <div className="flex items-center gap-space-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span>Vector DB: Supabase pgvector</span>
            </div>
            <span className="text-outline-variant hidden sm:inline">•</span>
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[14px] text-secondary">memory</span>
              <span>LLM: openai/gpt-oss-120b</span>
            </div>
            <span className="text-outline-variant hidden sm:inline">•</span>
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[14px] text-tertiary">data_object</span>
              <span className="text-on-surface font-medium">Embeddings: all-MiniLM-L6-v2</span>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-margin pb-space-xl max-w-6xl mx-auto flex flex-col gap-space-lg">
        <div className="flex items-baseline justify-between gap-space-md">
          <div>
            <div className="font-label-sm text-label-sm text-primary tracking-wider uppercase">Deep Dive Artifacts</div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight mt-space-xs">
              Recent Query Explorations & Sample Syntheses
            </h2>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant hidden md:block">
            Updated 14 mins ago • Real Telemetry Cohort
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="query-card group rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 p-space-lg shadow-xl shadow-black/30 flex flex-col justify-between relative overflow-hidden cursor-pointer" onClick={() => handleCardClick('What kinds of photos do users struggle to retrieve the most?')}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between gap-space-sm mb-space-md">
                <span className="px-space-sm py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-medium">
                  #FailureDistribution
                </span>

              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-medium leading-snug group-hover:text-primary transition-colors">
                What kinds of photos do users struggle to retrieve the most?
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">
                Analysis shows a high failure rate for utility documents, prescriptions, and receipts versus milestone events.
              </p>
            </div>
            <div className="mt-space-lg pt-space-md flex items-center justify-end">
              <button className="inline-flex items-center gap-space-xs font-label-md text-label-md text-primary group-hover:translate-x-1 transition-transform" type="button">
                <span>View Query Insights</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="query-card group rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 p-space-lg shadow-xl shadow-black/30 flex flex-col justify-between relative overflow-hidden cursor-pointer" onClick={() => handleCardClick('What information is forgotten first when looking for old photos?')}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-all pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between gap-space-sm mb-space-md">
                <span className="px-space-sm py-0.5 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm font-medium">
                  #MemoryRetention
                </span>

              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-medium leading-snug group-hover:text-secondary transition-colors">
                What information is forgotten first when looking for old photos?
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">
                Users retain visual cues and people reliably, but exact dates and locations are forgotten 86% of the time.
              </p>
            </div>
            <div className="mt-space-lg pt-space-md flex items-center justify-end">
              <button className="inline-flex items-center gap-space-xs font-label-md text-label-md text-secondary group-hover:translate-x-1 transition-transform" type="button">
                <span>View Query Insights</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="query-card group rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 p-space-lg shadow-xl shadow-black/30 flex flex-col justify-between relative overflow-hidden cursor-pointer" onClick={() => handleCardClick('Why do searches fail even when the user knows the photo exists?')}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary-container/5 rounded-full blur-2xl group-hover:bg-tertiary-container/10 transition-all pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between gap-space-sm mb-space-md">
                <span className="px-space-sm py-0.5 rounded-full bg-tertiary/10 text-tertiary-fixed font-label-sm text-label-sm font-medium">
                  #RootCause
                </span>

              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-medium leading-snug group-hover:text-tertiary-fixed transition-colors">
                Why do searches fail even when the user knows the photo exists?
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">
                The majority of search drop-offs are caused by metadata mismatch and vague semantic recognition failures.
              </p>
            </div>
            <div className="mt-space-lg pt-space-md flex items-center justify-end">
              <button className="inline-flex items-center gap-space-xs font-label-md text-label-md text-tertiary-fixed group-hover:translate-x-1 transition-transform" type="button">
                <span>View Query Insights</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>


      </section>
    </div>
  );
}
