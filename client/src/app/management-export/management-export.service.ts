import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import '../core/rxjs-extensions';
import { Observable } from 'rxjs/Observable';
import { config } from 'assets/config';

@Injectable()
export class ManagementExportService {
    private WebApiUrl: string;

    constructor(private http: Http) {
        this.WebApiUrl = config.WebApiBaseUrl + '/productiondata/excel';

    }

    export(location, fromDate: Date, toDate: Date): Observable<Object[]> {
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', this.WebApiUrl + '/' + fromDate.toDateString() +
                        '/' + toDate.toDateString() + '/' + location, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.responseType = 'blob';

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        let contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                        let blob = new Blob([xhr.response], { type: contentType });
                        observer.next(blob);
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };
            xhr.send();

        });
    }

    private handleError(error: Response) {
        let msg = `Status Code ${error.status} on url ${error.url}`;
        return Observable.throw(msg);
    }

}

