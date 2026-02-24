import {
  Component,
  Input,
  ContentChild,
  TemplateRef,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DataTableColumn } from './data-table-column.interface';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent<T = any> implements AfterViewInit {
  @Input() dataSource!: MatTableDataSource<T>;
  @Input() columns: DataTableColumn<T>[] = [];
  @Input() emptyMessage = 'Nenhum registro encontrado.';
  @Input() defaultSortColumn?: string;
  @Input() defaultSortDirection: 'asc' | 'desc' = 'desc';
  @Input() actionsColumnKey = 'acoes';
  @Input() expandableRowTemplate?: TemplateRef<{ $implicit: T }>;
  @Input() expandedRowWhen?: (index: number, row: T) => boolean;

  @ViewChild(MatSort) sort!: MatSort;
  @ContentChild('actionsCell') actionsCellTemplate?: TemplateRef<{ $implicit: T }>;

  get displayedColumns(): string[] {
    return this.columns.map((c) => c.key);
  }

  readonly noExpandWhen = () => false;

  hasActionsColumn(): boolean {
    return this.columns.some((c) => c.key === this.actionsColumnKey);
  }

  getCellValue(row: T, col: DataTableColumn<T>): string | number {
    if (col.getValue) {
      const v = col.getValue(row);
      return v ?? '-';
    }
    const v = (row as any)[col.key];
    return v ?? '-';
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    if (this.defaultSortColumn) {
      this.sort.active = this.defaultSortColumn;
      this.sort.direction = this.defaultSortDirection;
    }
  }
}
