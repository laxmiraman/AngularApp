import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import '../core/rxjs-extensions';
import { Observable } from 'rxjs/Observable';
import { config } from 'assets/config';



export class ProductionData {
  constructor(public Id: number, public MetricId: number, public LocationId: number,
              public MetricName: string, public MetricGroup: string, public Plan: number,
              public PlanValueActionType: number,  public Day: number,
              public DayValueActionType: number, public Mtd: number,
              public MtdValueActionType: number, public Ytd: number,
              public YtdValueActionType: number, public Comments: string) {}
}

@Injectable()
export class ProductionDataViewService {
    private WebApiUrl: string;

    constructor(private http: Http) {
        this.WebApiUrl = config.WebApiBaseUrl + '/productiondata';
        console.log(this.WebApiUrl);
    }

    getProductionData(location, fromDate: Date, toDate: Date) {
        return this.http.get(this.WebApiUrl + '/' + fromDate.toDateString()
                             + '/' + toDate.toDateString() + '/' + location)
                        .map((response: Response) => <ProductionData>response.json())
                        .catch(this.handleError);
    }

    private handleError(error: Response) {
        let msg = `Status Code ${error.status} on url ${error.url}`;
        return Observable.throw(msg);
    }
}
