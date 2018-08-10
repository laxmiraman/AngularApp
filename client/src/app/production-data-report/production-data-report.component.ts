import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ProductionData, CalculationStatus, ProductionDataReportService } from './production-data-report-service';
import * as _ from 'lodash';
import {Subscription} from 'rxjs';
import { ToastsManager, Toast } from 'ng2-toastr/ng2-toastr';
import { AppService } from '../core/app-service';


@Component({
  selector: 'app-production-data-report',
  templateUrl: './production-data-report.component.html',
  styleUrls: ['./production-data-report.component.css'],
  providers: [ProductionDataReportService]
})


export class ProductionDataReportComponent implements OnInit {
  private productionDataValues: ProductionData[] = [];
  private filteredProductionDataValues: ProductionData[] = [];
  private errorMessage: string;
  private myDatePickerOptions = {
      sunHighlight: false,
      dateFormat: 'mm-dd-yyyy',
      showClearDateBtn: false
  };
  private selectedDate;
  private busy: Subscription;
  private subscription: Subscription;



  constructor(public toastr: ToastsManager, private AppService: AppService, vcr: ViewContainerRef,
              private ProductionDataReportService: ProductionDataReportService) {
    this.toastr.setRootViewContainerRef(vcr);
    this.date.setDate(this.date.getDate() - 1);
    this.selectedDate = this.getFormattedDate(this.date);
  }

  ngOnInit() {
    this.subscription = this.AppService.dataString$
          .subscribe(
            data => {
              this.currentLocation = data, this.getProductionData();
            });

    if (this.currentLocation === undefined) {
      this.currentLocation = this.AppService.getLocation();
      this.getProductionData();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showSuccess() {
    this.toastr.success('Successfully saved and computed data', 'Success!');
  }

  showSaving() {
    this.toastr.info('Saving and computing...');
  }

  showError() {
    this.toastr.container = null;
    this.toastr.error('Bad Request');
  }

  onDateChanged(event: any) {
    this.date = event.jsdate;
    this.getProductionData();
    console.log(this.date);
  }

  getProductionData() {
    if (this.currentLocation !== undefined) {
     // get production data
     this.ProductionDataReportService.getProductionData(this.currentLocation.Id, this.date)
        .subscribe(
          productionData => this.productionDataValues = productionData,
          error => { this.errorMessage = <any>error; this.showError(); },
          () => this.onGetProductionDataSuccess()
        );
    // get calculation status
    this.ProductionDataReportService.getCalculationStatus(this.currentLocation.Id)
        .subscribe(
          calculationStatus => this.calculationStatus = calculationStatus,
          error => { this.errorMessage = <any>error;},
          () => this.onGetCalculationDateTimeSuccess()
        );
    }
  }

  onGetProductionDataSuccess() {
    if (this.productionDataValues.length > 0) { // array is not empty
      this.getMetricGroups();
    } else {
      this.filteredProductionDataValues = [];
      this.metricGroups = [];
    }
  }

  submitProductionData() {
    this.showSaving();
    this.ProductionDataReportService.postProductionData(this.productionDataValues, this.currentLocation.Id, this.date)
      .subscribe(
          productionData => this.productionDataValues,
          error => this.errorMessage = <any>error,
          () => this.onPostProductionDataSuccess()
    );
  }

  onPostProductionDataSuccess() {
    this.showSuccess();
    this.getProductionData();
  }


}
