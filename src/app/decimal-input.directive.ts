import { Directive, HostListener, ElementRef, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DecimalPipe } from './decimal.pipe';

@Directive({
  selector: '[decimalInput]'
})
export class DecimalInputDirective {

  /* Allow these keys
    * backspace = 8
    * delete = 46
    * left arrow	= 37
    * right arrow	= 39
    */

  allowedKeyCodes = [8, 37, 39, 46];

  el: any;
  nonRepetativeChars = ['.', ',', '-'];
  nonSimultaneousChars = ['.', ','];

  selectionStart: number;

  @Output() ngModelChange = new EventEmitter();

  constructor(private elementRef: ElementRef, private decimalPipe: DecimalPipe) {
    this.el = this.elementRef.nativeElement;
  }

  @Input() allowNegative: boolean;
  @Input() maxDecimalPart = 2;


  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {

    // Input value BEFORE current keydown event has been completed
    const inputValue = this.el.value;

    // Update information about cursor position
    this.setselectionStart();

    if (this.allowedKeyCodes.some(e => e === event.keyCode)) {
      return true;
    }

    /* 
    * Pattern to be allowed : number, decimal and comma
    * Note: In IE and Edge, the value for key property for '-' is 'Subtract' & 
    * ',' is Decimal
    * */
    const allowedChars = this.allowNegative ? /^(?:[0-9.,-]|Decimal|Subtract)+$/ : /^(?:[0-9.,]|Decimal)+$/;
    const inputChar = event.key;
    if (!allowedChars.test(inputChar)) {
      return false;
    }

    /* Allow '-' char only at the begenning of inputValue */
    if ((event.key === '-' || event.key === 'Subtract') && this.selectionStart > 0) {
      return false;
    }

    /* Prevent non repetative characters
     * nonRepetativeChars contains the key pressed &
     * and keypressed is already present in inputValue 
     * */
    if (this.nonRepetativeChars.some(c => c === event.key && inputValue.includes(c))) {
      return false;
    }

    /* Prevent non simultaneous characters
    * input value contains any of the character in nonSimultaneousChars array &
    * nonSimultaneousChars array contains event.key  
    * */
    if (this.nonSimultaneousChars.some(c => inputValue.includes(c)) &&
      this.nonSimultaneousChars.includes(event.key)) {
      return false;
    }
  }

  @HostListener('blur', ['$event'])
  onBlur() {
    this.ngModelChange.emit(this.decimalPipe.transform(this.el.value, this.maxDecimalPart));
  }

  @HostListener('click', ['$event'])
  onClick() {
    this.setselectionStart();
  }

  setselectionStart(): void {
    setTimeout(() => {
      this.selectionStart = this.el.selectionStart;
    });
  }

}
