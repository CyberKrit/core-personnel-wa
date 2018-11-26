import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import * as localForage from "localforage";

// custom imports
import { CoreService } from './modules/core/core.service';

@Injectable()
export class AppAuthCanctivate implements CanActivate {

	constructor(
		private $core: CoreService) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

			// if token exist it's okay then
			// x-auth header will get attached inside interceptor
			let token = this.$core.getToken();console.log('token', token);
			if( token ) {
				return true;
			}

			return localForage.getItem('token')
				.then(token => {
					console.log('getItem', token);
					return true;
				})
				.catch(() => {
					return false;
				});

	}

}