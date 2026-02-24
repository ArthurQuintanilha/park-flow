import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() inputName = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' | 'datetime-local' = 'text';
  @Input() inputDark = false;
  @Input() isDisabled = false;
  @Input() class = '';
  @Input() minHeightTextArea = '';
  @Input() min?: string;
  @Input() step?: string;

  @Output() valueChange = new EventEmitter<string>();
  @Output() keyUp = new EventEmitter<KeyboardEvent>();

  value = '';
  showPassword = false;

  private onChange: (val: string | number) => void = () => {};
  private onTouched: () => void = () => {};

  onInputHandler(event: Event): void {
    const el = event.target as HTMLInputElement | HTMLTextAreaElement;
    const val = el.value;
    this.value = val;
    const out = this.type === 'number' && val !== '' ? parseFloat(val) || 0 : val;
    this.onChange(out);
    this.valueChange.emit(val);
  }

  onKeyUp(event: KeyboardEvent): void {
    this.keyUp.emit(event);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: string | number): void {
    this.value = value != null ? String(value) : '';
  }

  registerOnChange(fn: (val: string | number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
