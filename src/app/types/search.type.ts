export interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  placehoder: string;
}
export interface SearchNotFound {
  message: string;
}
