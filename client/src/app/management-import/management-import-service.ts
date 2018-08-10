import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import '../core/rxjs-extensions';
import { Observable } from 'rxjs/Observable';
import { config } from 'assets/config';


export class ProductionData {
  constructor(public Id: number, public MetricId: number, public LocationId: number,
              public MetricName: string, public MetricGroup: string, public PlannedData: number,
              public ActualData: number, public Comments: string) {}
}
export class FileData {
  constructor(public Id: number, public MetricId: number, public LocationId: number,
              public MetricName: string, public MetricGroup: string, public PlannedData: number,
              public ActualData: number, public Comments: string) { }
}

@Injectable()
export class ManagementImportService {

    public plannedData;
    private WebApiUrl: string; // URL to web api

    constructor(private http: Http) {
        this.plannedData = [];
        this.WebApiUrl = config.WebApiBaseUrl + '/productiondata/csv';
    }

  BulkInsert(file) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let formData = new FormData();
        headers.append('Content-type', 'multipart/form-data');
        console.log(file.files[0]);
        formData.append('file', file.files[0]);

        return this.http.post(this.WebApiUrl, formData, headers)
                        .map((response: Response) => response.json())
                        .catch(this.handleError);
    }

    private handleError(error: Response) {
        let msg = `Status Code ${error.status} on url ${error.url}`;
        return Observable.throw(msg);
    }
}
