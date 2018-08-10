import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ProductionData, ProductionDataViewService } from './production-data-view-service';
import * as _ from 'lodash';
import {Subscription} from 'rxjs';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AppService } from '../core/app-service';


@Component({
  selector: 'app-production-data-view',
  templateUrl: './production-data-view.component.html',
  styleUrls: ['./production-data-view.component.css'],
  providers: [ProductionDataViewService]

})
export class ProductionDataViewComponent implements OnInit {
  private fromDate: Date = new Date();
  private toDate: Date = new Date();
  private currentLocation;
  private productionDataValues: ProductionData[] = [];
  private filteredProductionDataValues: ProductionData[] = [];
  private errorMessage: string;
  private metricGroups = [];
  private myDatePickerOptions = {
      sunHighlight: false,
      dateFormat: 'mm-dd-yyyy',
      showClearDateBtn: false
  };

  private selectedFromDate;
  private selectedToDate;
  private busy: Subscription;
  private subscription: Subscription;


  constructor(public toastr: ToastsManager, private AppService: AppService,
              vcr: ViewContainerRef, private ProductionDataViewService: ProductionDataViewService) {
    this.toastr.setRootViewContainerRef(vcr);
  }
  ngOnInit() {
    this.fromDate.setDate(this.fromDate.getDate() - 1);
    this.toDate.setDate(this.toDate.getDate() - 1);
    this.selectedFromDate = this.getFormattedDate(this.fromDate);
    this.selectedToDate = this.getFormattedDate(this.toDate);
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


  showError() {
    this.toastr.container = null;
    this.toastr.error('Bad Request');
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
    this.getProductionData();
    console.log(this.toDate);
  }

  onFromDateChanged(event: any) {
    this.fromDate = event.jsdate;
    this.getProductionData();
    console.log(this.fromDate);
  }

   getProductionData() {
    if (this.currentLocation !== undefined) {
      this.busy = this.ProductionDataViewService.getProductionData(this.currentLocation.Id, this.fromDate, this.toDate)
        .subscribe(
          productionData => this.productionDataValues = productionData,
          error => {this.errorMessage = <any>error; this.showError(); },
          () => this.onGetProductionDataSuccess()
        );
    }
  }


  onGetProductionDataSuccess() {
    this.getMetricGroups();
  }

  getMetricGroups() {
    this.metricGroups = _.uniqBy(this.productionDataValues, 'MetricGroup').sort();
    this.filterProductionData(this.metricGroups[0].MetricGroup);
  }

  filterProductionData(currentMetricGroup) {
    this.filteredProductionDataValues = this.productionDataValues.filter(function(data) {
      return data.MetricGroup === currentMetricGroup;
    });
  }


}
