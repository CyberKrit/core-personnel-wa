import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

// custom imports
import { IEditorResolveRes } from '../../../shared/interface/induction.interface';
import { InductionService } from '../induction.service';

@Injectable()
export class EditorResolve implements Resolve<IEditorResolveRes> {

	constructor(
		private $induction: InductionService) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IEditorResolveRes> | Promise<IEditorResolveRes> | IEditorResolveRes {

		let { ind, tmp, slide, action } = route.queryParams;
		return this.$induction.editorResolve({ ind, tmp, slide, action });

	}

}