import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

// custom imports
import { ICategories } from '../../../shared/interface/induction.interface';
import { InductionService } from '../induction.service';

@Injectable()
export class InductionCreateResolve implements Resolve<ICategories> {

	constructor(
		public inductionService: InductionService) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<ICategories> | Promise<ICategories> | ICategories {
			// return all available caterogy
			return this.inductionService.briefCategory();
	}
}