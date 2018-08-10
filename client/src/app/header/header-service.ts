import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import '../core/rxjs-extensions';
import { Observable } from 'rxjs/Observable';
import { config } from 'assets/config';



export class Location {
    constructor(public Id: number, public Name: string, public CreatedDatetime: Date, public ModifiedDatetime: Date) { }
}


@Injectable()
export class HeaderService {
    private WebApiUrl: string;  // URL to web API 

    constructor(private http: Http) {
        this.WebApiUrl = config.WebApiBaseUrl + '/location';
        console.log(this.WebApiUrl);
    }

    getLocations() {
        return this.http.get(this.WebApiUrl)
            .map((response: Response) => <Location>response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        let msg = `Status Code ${error.status} on url ${error.url}`;
        return Observable.throw(msg);
    }
}
