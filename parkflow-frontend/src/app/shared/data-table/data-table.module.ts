import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { DataTableComponent } from './data-table.component';

@NgModule({
  imports: [CommonModule, MatTableModule, MatSortModule],
  declarations: [DataTableComponent],
  exports: [DataTableComponent],
})
export class DataTableModule {}
