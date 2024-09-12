export type SortOrder = "asc" | "desc";

export type SortField = "created_at" | "filename";

export interface PageParameters {
  pageNumber: number;
  pageSize: number;
}

export const defaultPageParameters: PageParameters = {
  pageNumber: 1,
  pageSize: 10
};

export const sortOptions = [
  { label: "Sort By Created At (Asc)", value: "created_at_asc" },
  { label: "Sort By Filename (Asc)", value: "filename_asc" },
  { label: "Sort By Filename (Desc)", value: "filename_desc" }
];
