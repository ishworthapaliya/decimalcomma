import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimal'
})
export class DecimalPipe implements PipeTransform {

  transform(value: any): any {

    const comma = /[,]/g;    
    if (comma.test(value)) {
      value = value.replace(',', '.');
    }

    return this.truncateDecimals(+value, 2);
  }

  truncateDecimals = function (number, digits) {
    const multiplier = Math.pow(10, digits);
    const adjustedNum = number * multiplier;
    const truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
  };

}
