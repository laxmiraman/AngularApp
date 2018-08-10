import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ManagementExportService } from './management-export.service';
import {Subscription} from 'rxjs';
import { AppService } from '../core/app-service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


@Component({
  selector: 'app-management-export',
  templateUrl: './management-export.component.html',
  styleUrls: ['./management-export.component.css'],
  providers: [ManagementExportService]
})
export class ManagementExportComponent implements OnInit {

  private fromDate: Date = new Date();
  private toDate: Date = new Date();
  private currentLocation;
  private errorMessage: string;
  private blobResult;
  private show = false;
  private busy: Subscription;
  private subscription: Subscription;

  myDatePickerOptionsFromDate = {
      sunHighlight: false,
      dateFormat: 'mm-dd-yyyy' // ,
      // disableSince: {year: this.fromDate.getFullYear(), month: this.fromDate.getMonth() + 1, day: this.fromDate.getDate()},
  };

  myDatePickerOptionsToDate = {
      sunHighlight: false,
      dateFormat: 'mm-dd-yyyy'
      // disableSince: {year: this.fromDate.getFullYear(), month: this.fromDate.getMonth() + 1, day: this.fromDate.getDate()},
  };

  constructor(public toastr: ToastsManager, private AppService: AppService,
  vcr: ViewContainerRef, private ManagementExportService: ManagementExportService) {}

  ngOnInit() {
    console.log(this.fromDate.getFullYear());
    console.log(this.fromDate.getMonth() + 1);
    console.log(this.fromDate.getDate());
    this.subscription = this.AppService.dataString$
      .subscribe(
        data => {
          this.currentLocation = data;
        });
    if (this.currentLocation === undefined) {
      this.currentLocation = this.AppService.getLocation();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return month + '-' + day + '-' + year;
  }

  onToDateChanged(event: any) {
    this.toDate = event.jsdate;
    console.log(this.toDate);
    // if (this.toDate != null) {
     // this.myDatePickerOptionsFromDate.disableSince.year= this.toDate.getFullYear();
      // this.myDatePickerOptionsFromDate.disableSince.month= this.toDate.getMonth() + 1;
      // this.myDatePickerOptionsFromDate.disableSince.day= this.toDate.getDate();
    // } else {
      // this.myDatePickerOptionsFromDate.disableSince.year= this.today.getFullYear();
      // this.myDatePickerOptionsFromDate.disableSince.month= this.today.getMonth() + 1;
      // this.myDatePickerOptionsFromDate.disableSince.day= this.today.getDate();
    // }
  }

  onFromDateChanged(event: any) {
    this.fromDate = event.jsdate;
    console.log(this.fromDate);
  }

  export() {
    if (this.currentLocation !== undefined && this.fromDate <= this.toDate)  {
      this.busy = this.ManagementExportService.export(this.currentLocation.Id, this.fromDate, this.toDate)
          .subscribe(blob => {this.blobResult = blob; },
          error => console.log('Error downloading the file.'),
          () => this.onExportSuccess()
        );
    } else {
      this.showError('Start Date is greater than End Date');
    }
  }

  showError(msg) {
    this.toastr.container = null;
    this.toastr.error('Bad Request', msg);
  }


  onExportSuccess() {
  // Doing it this way allows you to name the file
    if (navigator.appVersion.toString().indexOf('.NET') > 0) { // for IE browser
        window.navigator.msSaveBlob(this.blobResult,
        this.getFormattedDate(this.fromDate) + '_'
        + this.getFormattedDate(this.toDate) + '.xlsx');
    } else { // for other browsers
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(this.blobResult);
      link.download = this.getFormattedDate(this.fromDate) + '_' + this.getFormattedDate(this.toDate) + '.xlsx';
      link.click();
    }
    this.show = false;
  }
}
