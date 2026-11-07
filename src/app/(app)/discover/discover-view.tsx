"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { ProfileCard } from "@/components/profile-card";
import {
  Button,
  EmptyState,
  Notice,
  PageLoader,
  Select,
} from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import {
  COMMUNITIES_LIST,
  DISCOVER_PAGE_SIZE,
  EDUCATION_LIST,
  EMPTY_DISCOVER_FILTERS,
  MATCH_FILTER_TABS,
  RELIGIONS_LIST,
  TOP_INDIAN_CITIES,
} from "@/lib/constants";
import type {
  DiscoverFilters,
  ProfileCard as ProfileCardData,
} from "@/lib/types";
import { useApi } from "@/lib/use-api";

export function DiscoverView() {
  const [draft, setDraft] = useState<DiscoverFilters>(EMPTY_DISCOVER_FILTERS);
  const [filters, setFilters] = useState<DiscoverFilters>(
    EMPTY_DISCOVER_FILTERS,
  );
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [more, setMore] = useState<ProfileCardData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState<boolean | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState<string | null>(null);

  const query = { ...filters, limit: DISCOVER_PAGE_SIZE };
  const first = useApi(JSON.stringify(filters), () =>
    api.discover({ ...query, page: 1 }),
  );

  function apply(next: DiscoverFilters) {
    setFilters(next);
    setMore([]);
    setPage(1);
    setHasMore(null);
    setMoreError(null);
    setShowMobileFilters(false);
  }

  function reset() {
    setDraft(EMPTY_DISCOVER_FILTERS);
    apply(EMPTY_DISCOVER_FILTERS);
  }

  async function loadMore() {
    setLoadingMore(true);
    setMoreError(null);
    try {
      const result = await api.discover({ ...query, page: page + 1 });
      setMore((current) => [...current, ...result.items]);
      setPage(page + 1);
      setHasMore(result.hasMore);
    } catch (err) {
      setMoreError(err instanceof ApiError ? err.message : String(err));
    } finally {
      setLoadingMore(false);
    }
  }

  const items = [...(first.data?.items ?? []), ...more];
  const canLoadMore = hasMore ?? first.data?.hasMore ?? false;
  const filtered = Object.values(filters).some(Boolean);

  return (
    <div>
      {/* Top Header & Tab Strip matching UI kit reference */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground">
          Find Matches
        </h1>

        {/* Center Pill Tabs */}
        <div className="flex items-center gap-1.5 bg-secondary/50 p-1 rounded-full border border-border/60 self-start lg:self-center">
          {MATCH_FILTER_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Sort Dropdown & Mobile Filter Button */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => setShowMobileFilters((s) => !s)}
            className="lg:hidden flex items-center gap-2 rounded-xl text-xs py-2 min-h-9"
          >
            <SlidersHorizontal className="size-3.5" />
            <span>Filters {filtered && "●"}</span>
          </Button>

          <button
            type="button"
            className="text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Sort: Most Relevant</span>
            <ChevronDown className="size-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Match Cards */}
      <div className="mt-8 grid lg:grid-cols-[250px_1fr] gap-8 items-start">
        {/* Filter Sidebar */}
        <aside
          className={`bg-card rounded-2xl border border-border/80 p-5 shadow-sm ${
            showMobileFilters
              ? "fixed inset-x-4 top-24 z-30 max-h-[80vh] overflow-y-auto block lg:relative lg:inset-auto lg:top-auto lg:max-h-none"
              : "hidden lg:block"
          }`}
        >
          <div className="flex justify-between items-center pb-3 border-b border-border/70">
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Filters
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={reset}
                className="text-xs text-primary font-semibold hover:underline cursor-pointer"
              >
                Clear All
              </button>
              {showMobileFilters && (
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="lg:hidden p-1 text-muted-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              apply(draft);
            }}
            className="mt-4 space-y-4"
          >
            {/* Age Range */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-foreground/80 mb-1.5">
                <span>Age Range</span>
                <span className="text-primary font-bold">
                  {draft.ageMin || "22"} – {draft.ageMax || "32"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={18}
                  max={80}
                  placeholder="22"
                  value={draft.ageMin}
                  onChange={(e) =>
                    setDraft({ ...draft, ageMin: e.target.value })
                  }
                  className="w-full bg-background border border-input rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                />
                <input
                  type="number"
                  min={18}
                  max={80}
                  placeholder="32"
                  value={draft.ageMax}
                  onChange={(e) =>
                    setDraft({ ...draft, ageMax: e.target.value })
                  }
                  className="w-full bg-background border border-input rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-foreground/80 mb-1.5">
                Location
              </label>
              <Select
                value={draft.city}
                onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                className="text-xs py-2 rounded-xl"
              >
                <option value="">Bengaluru</option>
                {TOP_INDIAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>

            {/* Community */}
            <div>
              <label className="block text-xs font-semibold text-foreground/80 mb-1.5">
                Community
              </label>
              <Select
                value={draft.community ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, community: e.target.value })
                }
                className="text-xs py-2 rounded-xl"
              >
                <option value="">Any</option>
                {COMMUNITIES_LIST.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>

            {/* Education */}
            <div>
              <label className="block text-xs font-semibold text-foreground/80 mb-1.5">
                Education
              </label>
              <Select
                value={draft.education ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, education: e.target.value })
                }
                className="text-xs py-2 rounded-xl"
              >
                <option value="">Any</option>
                {EDUCATION_LIST.map((edu) => (
                  <option key={edu} value={edu}>
                    {edu}
                  </option>
                ))}
              </Select>
            </div>

            {/* Profession */}
            <div>
              <label className="block text-xs font-semibold text-foreground/80 mb-1.5">
                Profession
              </label>
              <Select
                value={draft.religion}
                onChange={(e) =>
                  setDraft({ ...draft, religion: e.target.value })
                }
                className="text-xs py-2 rounded-xl"
              >
                <option value="">Any</option>
                {RELIGIONS_LIST.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full rounded-xl text-xs py-2.5 min-h-10 cursor-pointer">
                Apply Filters
              </Button>
            </div>
          </form>
        </aside>

        {/* Match Cards Grid */}
        <section className="min-w-0">
          {first.error && <Notice tone="error">{first.error}</Notice>}

          {first.loading && !items.length ? (
            <PageLoader />
          ) : items.length === 0 && !first.error ? (
            <EmptyState title="No profiles found">
              {filtered
                ? "Try widening or resetting your filters."
                : "New members join every day. Check back soon or broaden your preferences in your profile settings."}
            </EmptyState>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {items.map((profile) => (
                <ProfileCard key={profile.userId} profile={profile} />
              ))}
            </div>
          )}

          {moreError && (
            <div className="mt-6">
              <Notice tone="error">{moreError}</Notice>
            </div>
          )}

          {canLoadMore && !first.loading && (
            <div className="mt-10 flex justify-center">
              <Button variant="secondary" busy={loadingMore} onClick={loadMore}>
                Show more matches
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
