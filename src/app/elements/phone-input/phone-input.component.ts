import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import * as _ from 'lodash';


/**
 * International phone number input.
 *
 * @model ngModel - phone number value
 */
@Component({
  selector: 'app-phone-input',
  template: `<input class="form-control"
                    placeholder="Phone"
                    type="text"
                    [(ngModel)]="phone"
                    (ngModelChange)="onPhoneChange($event)"
                    [textMask]="{mask: phoneMask}" />`,
  styles: [`
  .form-control {
    display: block;
    width: 100%;
    height: 38px;
    padding: .5rem 0;
    border: 0;
    border-bottom: 1px solid #010DFF;
    background-color: transparent;
    color: rgba(31,30,170, .9);
    font-size: 18px;
    font-weight: 400;
    line-height: 22px;
    border-radius:0;

    &:focus {
      outline: 0 none;
    }
  }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true
    }
  ]
})
export class PhoneInputComponent implements ControlValueAccessor {
  phone: string;

  phoneMask = (value): any[] => {
    const localMask = [
      //'(', /\d/, /\d/, /\d/, ')',
      /\d/, /\d/, /\d/,
      '-', /\d/, /\d/, /\d/,
      '-', /\d/, /\d/, /\d/, /\d/];
    const cleanValue = value.replace(/[_()\-+]/g, '');
    let codeLength = cleanValue.length - 10;
    if (codeLength > 3) {
      codeLength = 3;
    } else if (codeLength < 1) {
      codeLength = 1;
    }
    return []
      .concat(['+']).concat(['('])
      .concat(_.map(_.range(codeLength), () => /\d/)).concat([')'])
      .concat(localMask);
  }

  onPhoneChange(phone: string) {
    this.onChange(phone.replace(/[()\-]/g, ''));
  }

  writeValue(value: string) {
    this.phone = value;
  }

  onChange = (_) => {};
  onTouched = () => {};
  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
