import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

// custom imports
import { IEditInductionResolve } from '../../../shared/interface/induction.interface';
import { InductionService } from '../induction.service';

@Injectable()
export class InductionEditResolve implements Resolve<IEditInductionResolve> {

	constructor(
		private inductionService: InductionService) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IEditInductionResolve> | Promise<IEditInductionResolve> | IEditInductionResolve {

		const URLArray = state.url.split('/');
		const inductionId = URLArray.pop();

		return this.inductionService.EditInduction(inductionId);

	}

}