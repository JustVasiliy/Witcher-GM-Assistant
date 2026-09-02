"use client";

import { useMemo, useState } from "react";
import { Button, Input } from "@/core/ui";
import type { Creature, CreatureType } from "../types";
import { countByType, filterCreatures, pageCount, paginate } from "../utils";
import { CreatureList } from "./CreatureList";
import { Pagination } from "./Pagination";
import { TypeFilter } from "./TypeFilter";
import {
  Header,
  HeaderText,
  Layout,
  Main,
  Page,
  ResultCount,
  SearchRow,
} from "./BestiaryBrowser.styles";

const PAGE_SIZE = 6;

type BestiaryBrowserProps = {
  creatures: Creature[];
};

export function BestiaryBrowser({ creatures }: BestiaryBrowserProps) {
  const [query, setQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Set<CreatureType>>(
    () => new Set(),
  );
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => filterCreatures(creatures, { query, types: selectedTypes }),
    [creatures, query, selectedTypes],
  );
  const counts = useMemo(() => countByType(creatures), [creatures]);
  const totalPages = pageCount(filtered.length, PAGE_SIZE);
  const currentPage = Math.min(page, totalPages);
  const visibleCreatures = paginate(filtered, currentPage, PAGE_SIZE);

  return (
    <Page>
      <Header>
        <HeaderText>
          <h1>Bestiary</h1>
          <p>Browse and manage creatures in your collection.</p>
        </HeaderText>
        <Button type="button" disabled>
          + New NPC
        </Button>
      </Header>
      <Layout>
        <Main>
          <SearchRow>
            <Input
              type="search"
              placeholder="Search creatures..."
              aria-label="Search creatures"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </SearchRow>
          <ResultCount>
            {filtered.length} {filtered.length === 1 ? "creature" : "creatures"}
          </ResultCount>
          <CreatureList creatures={visibleCreatures} />
          {totalPages > 1 && (
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={setPage}
            />
          )}
        </Main>
        <TypeFilter
          selected={selectedTypes}
          counts={counts}
          onChange={(next) => {
            setSelectedTypes(next);
            setPage(1);
          }}
        />
      </Layout>
    </Page>
  );
}
