import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

export class Location {
    constructor(public Id: number, public Name: string, public CreatedDatetime: Date, public ModifiedDatetime: Date) { }
}

@Injectable()
export class AppService {

    // Observable string source
    private dataStringSource = new Subject<Location>();
    private location;

    // Observable string stream
    dataString$ = this.dataStringSource.asObservable();

    setLocation(data: Location) {
        this.dataStringSource.next(data);
        this.location = data;
    }

    getLocation() {
        return this.location;
    }

    GetFromLacalStorage(){
     var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

}
