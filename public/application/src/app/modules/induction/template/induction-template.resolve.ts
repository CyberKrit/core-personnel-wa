import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

// custom imports
import { ITemplateResolveRes } from '../../../shared/interface/induction.interface';
import { InductionService } from '../induction.service';

@Injectable()
export class TemplateResolve implements Resolve<ITemplateResolveRes> {

	constructor(
		private $induction: InductionService) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ITemplateResolveRes> | Promise<ITemplateResolveRes> | ITemplateResolveRes {

		const URLArray = state.url.split('/');
		const inductionId = URLArray.pop();
		const action = route.queryParams.action;

		return this.$induction.templateResolve({ inductionId });

	}

}