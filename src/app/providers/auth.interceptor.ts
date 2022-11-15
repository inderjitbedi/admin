import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
// import 'rxjs/add/operator/mergeMap';
// import 'rxjs/add/operator/do';
import { AuthGuard } from './auth.guard';
import { AlertService } from './alert.service';
import { Constants } from './constant';
import { of as throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(public authGuard: AuthGuard, private alertService: AlertService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): any {
    let newReq = request;
    const access_token = localStorage.getItem('auth_token');
    if (access_token) {
      newReq = request.clone({ setHeaders: { Authorization: `Bearer ${access_token}` } });
    } 
    return next.handle(newReq).pipe(
      catchError((error: any) => {
        if (error.status === 401) {
          return this.handle401Error();
        }
        return throwError(error);
      })
    );
  }
  private handle401Error(): any {
      this.alertService.notify(Constants.ErrorMessages.sessionExpired);
      this.authGuard.logout();
      return null;
  }
}



