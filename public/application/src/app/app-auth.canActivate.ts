import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import * as localForage from "localforage";
localForage.config({
  name : 'CorePersonnelWA',
  version : 1.0,
  description : 'Local database solution for the Core Personnel WA web application'
});
let localStore = localForage.createInstance({
  name: "CorePersonnelWA"
});

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

			return localStore.getItem('dataSet')
				.then(data => {
					console.log('getItem', data);
					return true;
				})
				.catch(() => {
					return false;
				});

	}

}