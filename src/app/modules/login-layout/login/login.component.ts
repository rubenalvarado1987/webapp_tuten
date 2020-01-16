import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { PlatformLocation } from '@angular/common';

// SERVICES
import { AuthService } from './../../../services/auth.service';

// ERROR MESSAGE
import { SnackbarComponent } from '../../../components/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [ ]
})

export class LoginComponent implements OnInit {
    form: FormGroup;
    private formSubmitAttempt: boolean;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService ,
        private router: Router,
        public snack: MatSnackBar,
        private location: PlatformLocation
    ) {
        // AL PRECIONAR EL BOTON ATRAS O ADELANTE DEL NAVEGADOR REFRESCA LA PAGINA
        /*location.onPopState(() => {
            console.log('pressed back!');
            window.location.reload();
        });*/
    }

    ngOnInit() {
        /*SI EXISTE UN TOKEN SETEADO TE REDIRECCIONA AL DASHBOARD*/
        if(localStorage.getItem('token')){
            this.router.navigate(['/']);
        }

        this.form = this.fb.group({
            user_name: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    isFieldInvalid(field: string) {
        return (
            (!this.form.get(field).valid && this.form.get(field).touched) ||
            (this.form.get(field).untouched && this.formSubmitAttempt)
        );
    }

    onSubmit() {
        if (this.form.valid) {
            this.authService.login(this.form.value).subscribe((data: any) => {

                console.log('data response', data);

                if (data.active) {
                    this.authService.loggedIn.next(true); /*SETEA EL METODO loggedIn COMO TRUE EN EL AuthService*/
                    localStorage.setItem('token', data.sessionTokenBck); /*SETEA EL TOKEN PROCEDENTE DEL BACKEND*/
                    localStorage.setItem('adminemail', data.email); /*SETEA EL TOKEN PROCEDENTE DEL BACKEND*/
                    this.router.navigate(['/']); /*REDIRECCIONA AL DASHBOAR*/
                } else { /*SINO MUESTRA UN MENSAJE DE ERROR PROCEDENTE DEL BACKEND*/
                    console.log('usuario inactivo');
                }
            }, err =>
                //console.log(err)
                this.snack.openFromComponent(SnackbarComponent, {
                    data: { data : {message: err.error}},
                    duration: 3000
                })
                );
        }
        this.formSubmitAttempt = true;
    }
}
