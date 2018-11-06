import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

// custom imports
import { InductionService } from '../induction.service';
import { ISingleInductionViewData } from '../../../shared/interface/induction.interface';

@Injectable()
export class InductionSingleViewResolve implements Resolve<ISingleInductionViewData> {

	constructor(
		public inductionService: InductionService,
		public router: Router) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<ISingleInductionViewData> | Promise<ISingleInductionViewData> | ISingleInductionViewData {

			const URLArray = state.url.split('/');
			const inductionId = URLArray.pop();
			
			// return all available caterogy
			return  this.inductionService.SingleInductionView(inductionId);
	}

}