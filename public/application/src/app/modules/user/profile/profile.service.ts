import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// custom imports
import { CoreService } from '../../core/core.service';
import { IProfileResolveRes } from '../../../shared/interface/profile.interface';

@Injectable()
export class ProfileService { 
	private baseURL: string;

	constructor(
		private http: HttpClient,
		private $core: CoreService) {
			this.baseURL = $core.HOST;
		}

	public profileResolve(): Observable<any> {
		let url: string = this.baseURL + 'api/user/profile';

		return this.http
			.get<IProfileResolveRes>(url)
			.pipe(
				map(profileData => profileData),
				catchError(err => throwError(err))
			);
	}


	/* ==[ handleError ]== */
	private handleError(error: HttpErrorResponse) {
	  if (error.error instanceof ErrorEvent) {
	    // A client-side or network error occurred. Handle it accordingly.
	    console.error('An error occurred:', error.error.message);
	  } else {
	    // The backend returned an unsuccessful response code.
	    // The response body may contain clues as to what went wrong,
	    console.error(`Backend returned code ${error.status}`);
	    console.error(error.error);
	  }
	  // return an observable with a user-facing error message
	  return throwError('Something bad happened; please try again later.');
	};

}