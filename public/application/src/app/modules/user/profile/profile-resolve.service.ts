import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

// custom imports
import { ProfileService } from './profile.service';
import { IProfileResolveRes } from '../../../shared/interface/profile.interface';

@Injectable()
export class ProfileResolve implements Resolve<IProfileResolveRes> {

	constructor(
		private $profile: ProfileService) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProfileResolveRes> | Promise<IProfileResolveRes> | IProfileResolveRes {
		return this.$profile.profileResolve();
	}

}