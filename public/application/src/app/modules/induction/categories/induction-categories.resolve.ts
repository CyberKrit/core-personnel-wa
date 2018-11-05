import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

// custom imports
import { InductionService } from '../induction.service';
import { ICategories } from '../../../shared/interface/induction.interface';

@Injectable()
export class InductionCategoriesResolve implements Resolve<ICategories[]> {

	constructor(
		public inductionService: InductionService) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<ICategories[]> | Promise<ICategories[]> | ICategories[] {
			// return all available caterogy
			return this.inductionService.listCategory();
	}

}