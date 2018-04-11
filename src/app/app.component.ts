import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'app';
  decimalNumber: any = 'try numbers and strings here';
  valueType: string;
  negativeOrPositive = 'Unknown';
  maxDecimalPart = 5;

  ngOnInit(): void {
    this.valueType = typeof this.decimalNumber;
  }

  checkType(event) {
    this.valueType = typeof this.decimalNumber;
    this.negativeOrPositive = this.decimalNumber ? this.decimalNumber >= 0 ? 'Positive' : 'Negative' : 'Unknown';
  }
}
