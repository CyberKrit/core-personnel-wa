import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ICanDeactivateGuard {
	canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export class EditorCanDeactivate implements CanDeactivate<ICanDeactivateGuard> {

	canDeactivate(
		component: ICanDeactivateGuard,
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
		nextState: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
			return component.canDeactivate ?  component.canDeactivate() : true;
	}

}