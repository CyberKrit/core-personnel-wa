import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import * as localForage from "localforage";

///////////////////////////////////
// localForage.config({
//   name : 'CorePersonnelWA',
//   version : 1.0,
//   description : 'Local database solution for the Core Personnel WA web application'
// });
// localForage.setItem('dataSet', {
// 	token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYXV0aCIsIl9pZCI6IjViZmJjNWZjYjQ1MzUzMWZjODk3MWM0NSIsImlhdCI6MTU0MzcyODUyNX0.1Zz7UPw4KvnX0QO16zIZc1UxJXAP8daqHUoRy4-0yIc'
// });
//////////////////////////////////

let localStore = localForage.createInstance({
  name: "CorePersonnelWA"
});

// custom imports
import { CoreService } from './modules/core/core.service';

@Injectable()
export class AppAuthCanctivate implements CanActivate {

	constructor(
		private $core: CoreService,
		private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

			// if token exist it's okay then
			// x-auth header will get attached inside interceptor
			let token = this.$core.getToken();
			if( token ) {console.log('token exists', token);
				return true;
			}

			return localStore.getItem('dataSet')
				.then((data: { token: string }) => {
					if( data && data.hasOwnProperty('token') ) {
						if( typeof data.token === 'string' ) {console.log('token local', token);
							this.$core.setToken(data.token);
							return true;
						}
					} else {
						return this.authFailed();
					}
					
				})
				.catch(() => {
					return this.authFailed();
				});

	}

	private authFailed(): boolean {
		this.router.navigate(['/login']);
		return false;
	}

}