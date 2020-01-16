import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders }  from "@angular/common/http";
import { User } from '../models/user';
import { CONSTANST } from '../utils/constanst';

@Injectable()
export class AuthService {
    public loggedIn = new BehaviorSubject<boolean>(this.hasToken());

    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }

    constructor(
        private router: Router,
        public http:HttpClient
    ) {}

    headers = new HttpHeaders({
        'x-access-token': localStorage.getItem('token')
    });

    login(user: User) {

        console.log('user:', user);

        const headers_login = new HttpHeaders({
            'Accept': 'application/json',
            'App': 'APP_BCK',
            'email': user.user_name,
            'Password': user.password
        });

        if (user.user_name !== '' && user.password !== '') {
            return this.http
            .put(CONSTANST.routes.authorization.login + user.user_name,
                {
                    'email': user.user_name,
                    'Password': user.password
                },
                { headers: headers_login });
        }
    }

    logout() {
        return this.http.get(CONSTANST.routes.authorization.logout, { headers: this.headers });
    }

    hasToken():boolean {
        return !!localStorage.getItem('token');
    }
}