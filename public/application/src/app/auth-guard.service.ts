import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

// custom imports
import { AuthService } from './auth.service';

@Injectable()

export class AuthGuard implements CanActivate {

	constructor(
		private authService: AuthService,
		private router: Router
		) {}

	canActivate(
		route: ActivatedRouteSnapshot, 
		state: RouterStateSnapshot
		): Observable<boolean> | Promise<boolean> | boolean {

			return this.authService.isAuthenticated()
				.then(() => true)
				.catch(err => {
					this.router.navigate(['/dashboard']);
					return false;
				});

	}

}