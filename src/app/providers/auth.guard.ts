import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Constants } from './constant';
import { AlertService } from './alert.service';
import { GetSetService } from './getSet.provider';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private getSetService: GetSetService,
    public alertService: AlertService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }

  checkLogin(url: string): boolean {
    console.log("checkLogin:url = ",url)
    if (!localStorage.getItem('auth_token')) {
      if (url.indexOf('login') === -1) {
        this.router.navigate([Constants.Pages.LOGIN]);
        return false;
      } else {
        return true;
      }
    } else {
      
    console.log("checkLogin:else:url = ",url)
      if (url.indexOf('login') > -1) {
        this.router.navigate([Constants.Pages.DASHBOARD]);
        return false;
      }
    }
    return true;
  }

  isAuthenticated(): void {
    if (localStorage.getItem('auth_token')) {
      this.router.navigate([Constants.Pages.DASHBOARD]);
    } else {
      this.router.navigate([Constants.Pages.LOGIN]);
    }
  }

  logout(): void {
    this.clearAll();
  }

  sessionExpired(): void {
    this.clearAll();
    this.alertService.notify(Constants.ErrorMessages.sessionExpired);
  }

  clearAll(): void {
    this.router.navigate([Constants.Pages.LOGIN]);
    localStorage.removeItem('user_info');
    localStorage.removeItem('auth_token');
  }
}
