"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { ProfileCard } from "@/components/profile-card";
import {
  Button,
  EmptyState,
  Field,
  Input,
  Notice,
  PageLoader,
  Select,
} from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import {
  DISCOVER_PAGE_SIZE,
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-tertiary text-xs font-bold uppercase tracking-widest">
            Discover
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-heading font-bold text-foreground">
            Find Matches
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Thoughtful introductions based on mutual values, background and life goals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowMobileFilters((s) => !s)}
            className="lg:hidden flex items-center gap-2"
          >
            <SlidersHorizontal className="size-4" />
            <span>Filters {filtered && "●"}</span>
          </Button>

          <div className="relative">
            <button
              type="button"
              className="min-h-11 px-4 rounded-lg border border-border bg-card text-foreground font-semibold text-sm flex items-center gap-2 hover:bg-secondary/40"
            >
              <span>Sort: Most relevant</span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Matches */}
      <div className="mt-8 grid lg:grid-cols-[260px_1fr] gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside
          className={`bg-card rounded-xl border border-border p-5 shadow-sm ${
            showMobileFilters
              ? "fixed inset-x-4 top-24 z-30 max-h-[80vh] overflow-y-auto block lg:relative lg:inset-auto lg:top-auto lg:max-h-none"
              : "hidden lg:block"
          }`}
        >
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <h2 className="text-base font-heading font-bold text-foreground">
              Filters
            </h2>
            <div className="flex items-center gap-2">
              {filtered && (
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Clear all
                </button>
              )}
              {showMobileFilters && (
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="lg:hidden p-1 text-muted-foreground"
                >
                  <X className="size-5" />
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
            <Field label="Age from">
              <Input
                type="number"
                min={18}
                max={80}
                placeholder="18"
                value={draft.ageMin}
                onChange={(e) =>
                  setDraft({ ...draft, ageMin: e.target.value })
                }
              />
            </Field>

            <Field label="Age to">
              <Input
                type="number"
                min={18}
                max={80}
                placeholder="80"
                value={draft.ageMax}
                onChange={(e) =>
                  setDraft({ ...draft, ageMax: e.target.value })
                }
              />
            </Field>

            <Field label="Location">
              <Select
                value={draft.city}
                onChange={(e) => setDraft({ ...draft, city: e.target.value })}
              >
                <option value="">Any city</option>
                {TOP_INDIAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Religion">
              <Select
                value={draft.religion}
                onChange={(e) =>
                  setDraft({ ...draft, religion: e.target.value })
                }
              >
                <option value="">Any religion</option>
                {RELIGIONS_LIST.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </Field>

            <div className="pt-2">
              <Button type="submit" className="w-full">
                Apply filters
              </Button>
            </div>
          </form>
        </aside>

        {/* Matches Section */}
        <section className="min-w-0">
          {/* Quick Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {MATCH_FILTER_TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all shrink-0 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card border border-border text-foreground hover:bg-secondary/40"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {first.error && <Notice tone="error">{first.error}</Notice>}

          {first.loading ? (
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
