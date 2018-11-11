import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from  '@angular/router';
import { Observable } from 'rxjs';

// custom imports
import { InductionService } from '../induction.service';

@Injectable()
export class InductionSingleResolve implements Resolve<any> {

	constructor(
		private $induction: InductionService) {}

	resolve(
		route: ActivatedRouteSnapshot, 
		state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
		// cache route url
		const routeUrl = state.url.split('?');
		// get induction id
		let inductionId = routeUrl[0].split('/').pop();
		// get slide index
		let slideIndexClass = new URLSearchParams(routeUrl[1]);
		let slideIndex = slideIndexClass.get('index');

		return this.$induction.InductionSingleResolve(inductionId, slideIndex);
	}

}