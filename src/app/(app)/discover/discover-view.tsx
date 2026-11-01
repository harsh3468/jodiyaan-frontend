"use client";

import { useState } from "react";
import { ProfileCard } from "@/components/profile-card";
import {
  Button,
  EmptyState,
  Field,
  Input,
  Notice,
  PageHeader,
  PageLoader,
  Select,
} from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import type { ProfileCard as ProfileCardData } from "@/lib/types";
import { useApi } from "@/lib/use-api";

const PAGE_SIZE = 12;
const EMPTY_FILTERS = { ageMin: "", ageMax: "", city: "", religion: "" };
type Filters = typeof EMPTY_FILTERS;

export function DiscoverView() {
  const [draft, setDraft] = useState<Filters>(EMPTY_FILTERS);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [more, setMore] = useState<ProfileCardData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState<boolean | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState<string | null>(null);

  const query = { ...filters, limit: PAGE_SIZE };
  const first = useApi(JSON.stringify(filters), () =>
    api.discover({ ...query, page: 1 }),
  );

  function apply(next: Filters) {
    setFilters(next);
    setMore([]);
    setPage(1);
    setHasMore(null);
    setMoreError(null);
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
    <>
      <PageHeader
        title="Discover"
        subtitle="Profiles that fit your preferences, most recently active first."
        action={
          <Button variant="secondary" onClick={() => setShowFilters((s) => !s)}>
            {showFilters ? "Hide filters" : "Filters"}
          </Button>
        }
      />

      {showFilters && (
        <form
          className="mb-8 grid gap-4 rounded-2xl border border-line bg-card p-5 sm:grid-cols-5 sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            apply(draft);
          }}
        >
          <Field label="Age from">
            <Input
              type="number"
              min={18}
              max={80}
              value={draft.ageMin}
              onChange={(e) => setDraft({ ...draft, ageMin: e.target.value })}
            />
          </Field>
          <Field label="Age to">
            <Input
              type="number"
              min={18}
              max={80}
              value={draft.ageMax}
              onChange={(e) => setDraft({ ...draft, ageMax: e.target.value })}
            />
          </Field>
          <Field label="City">
            <Input
              value={draft.city}
              onChange={(e) => setDraft({ ...draft, city: e.target.value })}
            />
          </Field>
          <Field label="Religion">
            <Select
              value={draft.religion}
              onChange={(e) => setDraft({ ...draft, religion: e.target.value })}
            >
              <option value="">Any</option>
              {["Hindu", "Muslim", "Sikh", "Christian", "Jain", "Buddhist"].map(
                (r) => (
                  <option key={r}>{r}</option>
                ),
              )}
            </Select>
          </Field>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Apply
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setDraft(EMPTY_FILTERS);
                apply(EMPTY_FILTERS);
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      )}

      {first.error && <Notice>{first.error}</Notice>}
      {first.loading ? (
        <PageLoader />
      ) : items.length === 0 && !first.error ? (
        <EmptyState title="No new profiles right now">
          {filtered
            ? "Try widening your filters."
            : "New members join every day. Check back soon, or widen your partner age range in your profile."}
        </EmptyState>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((profile) => (
            <ProfileCard key={profile.userId} profile={profile} />
          ))}
        </div>
      )}

      {moreError && (
        <div className="mt-6">
          <Notice>{moreError}</Notice>
        </div>
      )}
      {canLoadMore && !first.loading && (
        <div className="mt-8 flex justify-center">
          <Button variant="secondary" busy={loadingMore} onClick={loadMore}>
            Show more
          </Button>
        </div>
      )}
    </>
  );
}
