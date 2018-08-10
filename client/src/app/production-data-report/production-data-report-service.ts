import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import '../core/rxjs-extensions';
import { Observable } from 'rxjs/Observable';
import { config } from 'assets/config';

export class ProductionData {
  constructor(public Id: number, public MetricId: number, public LocationId: number,
              public MetricName: string, public MetricGroup: string, public Plan: number,
              public PlanValueActionType: number,  public Day: number,
              public DayValueActionType: number, public Mtd: number, public MtdValueActionType: number,
              public Ytd: number, public YtdValueActionType: number,
              public Comments: string) {}
}

export class Location {
    constructor(public Id: number, public Name: string, public CreatedDateTime: Date, public ModifiedDateTime: Date) { }
}

export class CalculationStatus {
    constructor(public Id: number, public CalculationDateTime: Date) { }
}

@Injectable()
export class ProductionDataReportService {
    private WebApiUrl: string;

    constructor(private http: Http) {
        this.WebApiUrl = config.WebApiBaseUrl + '/productiondata';
    }

    getProductionData(location, date: Date) {
        return this.http.get(this.WebApiUrl + '/' + date.toDateString() + '/' + location)
                        .map((response: Response) => <ProductionData>response.json())
                        .catch(this.handleError);
    }

    getCalculationStatus(location) {
        return this.http.get(this.WebApiUrl + '/Status/Calculation' + '/' + location)
                        .map((response: Response) => <CalculationStatus>response.json())
                        .catch(this.handleError);
    }

    postProductionData(productionData, location, date: Date) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let body = JSON.stringify(productionData);

        return this.http.post(this.WebApiUrl + '/' + date.toDateString() + '/' + location, body, headers)
               .map((response: Response) => response.json())
               .catch(this.handleError);
    }

    private handleError(error: Response) {
        let msg = `Status Code ${error.status} on url ${error.url}`;
        return Observable.throw(msg);
    }
}
