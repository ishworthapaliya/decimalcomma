import { Directive, HostListener, ElementRef, OnInit, Output, EventEmitter, Input, Renderer2 } from '@angular/core';
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

  constructor(private elementRef: ElementRef, private decimalPipe: DecimalPipe, private renderer: Renderer2) {
    this.el = this.elementRef.nativeElement;
  }

  @Input() allowNegative: boolean;
  @Input() maxDecimalPart = 2;
  @Input() minValue: number = undefined;
  @Input() maxValue: number = undefined;


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

    /*
    * Fix for browsers which do not have event.key property, ex. iPad safari
    */
    this.allowedKeyCodes.push(48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 190, 188);

    if (this.allowNegative) {
      this.allowedKeyCodes.push(189);
    }

    const inputChar = event.key;

    if (inputChar != undefined) {
      if (!allowedChars.test(inputChar)) {
        return false;
      }
    }

    if (inputChar == undefined) {
      if (this.allowedKeyCodes.some(e => e !== event.keyCode)) {
        return false;
      }
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

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    const inputValue = this.el.value;
    const parent = this.elementRef.nativeElement.parentNode;
    const errorDiv = this.renderer.createElement('div');
    const text = this.renderer.createText('NAN');
    this.renderer.addClass(errorDiv, 'error');
    const sibling = parent.children[1];

    this.renderer.insertBefore(parent, errorDiv, this.elementRef.nativeElement.firstChild);
    this.renderer.appendChild(errorDiv, this.renderer.createText('event key:' + event.key + '          '));
    this.renderer.appendChild(errorDiv, this.renderer.createText('event keyCode:' + event.keyCode));

    if (sibling) {
      this.renderer.removeChild(parent, sibling)
    }


    if (inputValue && isNaN(parseFloat(inputValue))) {
      this.renderer.appendChild(errorDiv, text);
      this.renderer.insertBefore(parent, errorDiv, this.elementRef.nativeElement.firstChild);
    }

  }

  @HostListener('blur', ['$event'])
  onBlur() {

    if (this.minValue != null || this.minValue != undefined || this.maxValue != null || this.maxValue != undefined) {
      this.handleMinMaxValue();
    }

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


  handleMinMaxValue(): any {
    if ((this.minValue != null || this.minValue != undefined) && (this.el.value < this.minValue)) {
      console.log('min value can be ' + this.el.value);
      return;
    }
  }

}
