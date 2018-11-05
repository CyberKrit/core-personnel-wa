import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

// custom import
import { InductionService } from '../induction.service';
import { IListInduction } from '../../../shared/interface/induction.interface';

@Injectable()
export class InductionListResolve implements Resolve<IListInduction[]> {

	constructor(
		private inductionService: InductionService) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IListInduction[]> | Promise<IListInduction[]> | IListInduction[] {
		return this.inductionService.listInduction();
	}

}