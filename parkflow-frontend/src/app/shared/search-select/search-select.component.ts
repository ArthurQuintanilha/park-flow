import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostListener,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export interface SelectItem {
  value: unknown;
  label: string;
}

@Component({
  selector: 'app-search-select',
  templateUrl: './search-select.component.html',
  styleUrls: ['./search-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchSelectComponent),
      multi: true,
    },
  ],
})
export class SearchSelectComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() inputName = '';
  @Input() placeholder = 'Selecione';
  @Input() items: SelectItem[] | Record<string, unknown>[] = [];
  @Input() valueKey?: string;
  @Input() labelKey?: string;
  @Input() inputDark = false;
  @Input() isDisabled = false;
  @Input() isLoading = false;

  @Output() itemSelected = new EventEmitter<SelectItem | null>();

  @ViewChild('inputRef') inputRef?: ElementRef<HTMLInputElement>;

  value: unknown = null;
  searchText = '';
  isOpen = false;
  filteredItems: SelectItem[] = [];

  private onChange: (val: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  get displayLabel(): string {
    if (this.value == null) return '';
    const item = this.normalizedItems.find(
      (i) => String(i.value) === String(this.value)
    );
    return item?.label ?? '';
  }

  get normalizedItems(): SelectItem[] {
    if (!this.valueKey && !this.labelKey) return this.items as SelectItem[];
    return (this.items as Record<string, unknown>[]).map((item) => ({
      value: item[this.valueKey ?? 'value'],
      label: String(item[this.labelKey ?? 'label'] ?? ''),
    }));
  }

  ngOnInit(): void {
    this.filteredItems = [...this.normalizedItems];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.filteredItems = [...this.normalizedItems];
      this.filterItems();
    }
  }

  constructor(private el: ElementRef<HTMLElement>) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!this.el.nativeElement.contains(target)) {
      this.close();
    }
  }

  onContainerClick(): void {
    if (this.isDisabled) return;
    if (!this.isOpen) {
      this.isOpen = true;
      this.searchText = '';
      this.filterItems();
      setTimeout(() => this.inputRef?.nativeElement.focus(), 0);
    }
  }

  filterItems(): void {
    const normalized = this.normalizedItems;
    const search = this.normalizeString(this.searchText);
    this.filteredItems = search
      ? normalized.filter((item) =>
          this.normalizeString(item.label).includes(search)
        )
      : [...normalized];
  }

  private normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, '');
  }

  onSearchInput(event: Event): void {
    this.searchText = (event.target as HTMLInputElement).value;
    this.filterItems();
  }

  selectItem(item: SelectItem): void {
    this.value = item.value;
    this.isOpen = false;
    this.searchText = '';
    this.onChange(item.value);
    this.itemSelected.emit(item);
  }

  clearSelection(event: Event): void {
    event.stopPropagation();
    this.value = null;
    this.isOpen = false;
    this.onChange(null);
    this.itemSelected.emit(null);
  }

  close(): void {
    this.isOpen = false;
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: unknown): void {
    this.value = value;
  }

  registerOnChange(fn: (val: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
