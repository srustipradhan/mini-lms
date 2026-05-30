export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface ApiErrorPayload {
  message?: string;
  errors?: Record<string, string[]>;
}
