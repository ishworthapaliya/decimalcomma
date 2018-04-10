import { Directive, HostListener, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
import { DecimalPipe } from './decimal.pipe';

@Directive({
  selector: '[decimalInput]'
})
export class DecimalInputDirective {

  el: any;
  nonRepetativeChars = ['.', ','];
  nonSimultaneousChars = ['.', ','];
  @Output() ngModelChange = new EventEmitter();

  constructor(private elementRef: ElementRef, private decimalPipe: DecimalPipe) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {

    // Input value BEFORE current keydown event has been completed
    const inputValue = this.el.value;

    /* Allow these keys
    * backspace = 8
    * delete = 46
    * left arrow	= 37
    * right arrow	= 39
    */
    if (event.keyCode === 8 || event.keyCode === 46 ||
      event.keyCode === 37 || event.keyCode === 39) {
      return true;
    }

    // Pattern to be allowed : number, decimal and comma
    const allowedChars = /^(?:[0-9.,])+$/;
    const inputChar = event.key;
    if (!allowedChars.test(inputChar)) {
      return false;
    }

    /* Prevent non repetative characters
     * nonRepetativeChars contains the key pressed
     * and keypressed is already present in inputValue */
    if (this.nonRepetativeChars.some(c => c === event.key && inputValue.includes(c))) {
      return false;
    }

    /* Prevent non simultaneous characters
    * input value contains any of the character in nonSimultaneousChars array
    * nonSimultaneousChars array contains event.key  */
    if (this.nonSimultaneousChars.some(c => inputValue.includes(c)) &&
      this.nonSimultaneousChars.includes(event.key)) {
      return false;
    }

  }

  @HostListener('blur', ['$event'])
  onBlur() {
    this.ngModelChange.emit(this.decimalPipe.transform(this.el.value));
  }

}
