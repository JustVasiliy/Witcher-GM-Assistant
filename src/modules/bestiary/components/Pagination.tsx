"use client";

import { Nav, PageButton } from "./Pagination.styles";

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <Nav aria-label="Bestiary pagination">
      <PageButton
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        &larr;
      </PageButton>
      {pages.map((pageNumber) => (
        <PageButton
          key={pageNumber}
          type="button"
          $active={pageNumber === page}
          aria-current={pageNumber === page ? "page" : undefined}
          onClick={() => onChange(pageNumber)}
        >
          {pageNumber}
        </PageButton>
      ))}
      <PageButton
        type="button"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        &rarr;
      </PageButton>
    </Nav>
  );
}
