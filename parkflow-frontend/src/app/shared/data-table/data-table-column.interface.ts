export interface DataTableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  getValue?: (row: T) => string | number | null | undefined;
}
