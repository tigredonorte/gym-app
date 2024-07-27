export interface IPaginationRequest<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface IPagination<T> extends IPaginationRequest<T> {
  pages: Record<string, T[]>;
}
