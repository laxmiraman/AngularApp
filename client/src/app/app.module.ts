import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import * as wjFilter from 'wijmo/wijmo.angular2.grid.filter';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';
import { MyDatePickerModule } from 'mydatepicker';
import { AppComponent } from './app.component';
import { AppRoutingModule, routableComponents } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import {BusyModule} from 'angular2-busy';
import {ToastModule, ToastOptions} from 'ng2-toastr/ng2-toastr';
import {AppService} from './core/app-service';
import {NgSelectizeModule} from 'ng-selectize';
import {Ng2SelectizeModule} from 'ng2-selectize';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { CustomOption } from './custom-option';
import { LoginComponent } from './login/login.component';

let options: ToastOptions = new ToastOptions();
options.positionClass = 'toast-top-left';
options.dismiss = 'click';
options.showCloseButton = true;

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    WjGridModule,
    wjFilter.WjGridFilterModule,
    WjInputModule,
    MyDatePickerModule,
    BusyModule,
    ToastModule.forRoot(),
    NgSelectizeModule,
      Ng2SelectizeModule,
      ChartsModule
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    routableComponents,
    LoginComponent
    ],

  providers: [
    AppService, {provide: ToastOptions, useClass: CustomOption}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
