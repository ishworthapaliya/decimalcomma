import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DecimalPipe } from './decimal.pipe';
import { DecimalInputDirective } from './decimal-input.directive';


@NgModule({
  declarations: [
    AppComponent,
    DecimalPipe,
    DecimalInputDirective
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
