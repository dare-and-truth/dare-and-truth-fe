export interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  totalPages: number;
  totalEntries: number;
  itemsPerPage: number;
}
