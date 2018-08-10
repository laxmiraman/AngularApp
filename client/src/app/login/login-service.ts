import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import '../core/rxjs-extensions';
import { Observable } from 'rxjs/Observable';
import { config } from 'assets/config';

export class Login  {
  constructor(public UserLocationId: number, 
              public LocationId: number,
              public UserId: number,
              public UserName: string,
              public Password: string,
              public RoleId: number,
              public RoleName: string) {}
}

export class Location {
    constructor(public Id: number, public Name: string, public CreatedDatetime: Date, public ModifiedDatetime: Date) { }
}

// Services for http request
@Injectable()
export class LoginService {
    private WebApiUrl: string;
   // private locationUrl: string;

    constructor(private http: Http) {
        this.WebApiUrl = config.WebApiBaseUrl+'/login';
        console.log(this.WebApiUrl);
    }

    getAuthenticate(username: string, password: string)  {
        console.log("Inside service- getAuthenticate method");
        return this.http.get(this.WebApiUrl + '/' +username + '/' + password)
                        .map((response: Response) => <Login>response.json())
                        .catch(this.handleError);
                       
    }


    private handleError(error: Response) {
        let msg = `Status Code ${error.status} on url ${error.url}`;
        return Observable.throw(msg);
    }


}
