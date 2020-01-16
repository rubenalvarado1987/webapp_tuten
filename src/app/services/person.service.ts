import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders }  from "@angular/common/http";
import { CONSTANST } from '../utils/constanst';
import { Person } from '../models/Person';

@Injectable()
export class PersonService {
    loading:boolean = true;

    constructor(
        private router: Router,
        public http:HttpClient
    ) { }

    headers = new HttpHeaders({
        'Token': localStorage.getItem('token'),
        'Accept' : 'application/json',
        'App': 'APP_BCK',
        'Adminemail' : localStorage.getItem('adminemail'),
        'email' : 'contacto@tuten.cl'
    });

    //getList(sortActive: string, order: string, pageSize: number, page: number, search: string) {
    getList() {

        let params = new HttpParams();
        params = params.append('current', 'true');
        //params = params.append('order', order);
        //params = params.append('search', search);
        //params = params.append('pageSize', pageSize.toString());
        //params = params.append('page', page.toString());
        
        return this.http.get<any>(CONSTANST.routes.person.list, {headers: this.headers, params: params});
    }

    delete(id: number){
        return this.http.delete(
            CONSTANST.routes.person.delete.replace(':id', String(id)),
            { headers: this.headers }
        );
    }

    getOne(id: number){
        return this.http.get(
            CONSTANST.routes.person.get.replace(':id', String(id)),
            { headers: this.headers }
        );
    }

    save(person: Person){
        return this.http.post(
            CONSTANST.routes.person.save, {
                txtFirstName: person.first_name,
                txtLastName: person.last_name,
                txtAge: person.age,
                txtGender: person.gender,
                id: person.id
            },
            { headers: this.headers }
        );
    }
}

export interface PersonApi {
    success: boolean,
    data: Person[],
    total: number,
    pageSize: number,
    page: number
}