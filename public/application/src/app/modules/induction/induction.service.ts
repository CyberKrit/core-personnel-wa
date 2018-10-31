import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class InductionService {

	private headers: Headers;
	private options: RequestOptions;

	constructor(
		private http: Http) {}

	public createCategory(req): Observable<any> {
		const baseurl =  'http://localhost:3000/api/induction-cat';

		const headers = new Headers({ 
			'Content-Type': 'application/json', 
			'Accept': 'application/json'
		});
		const options = new RequestOptions({ headers: headers });

		return this.http
			.post(baseurl, JSON.stringify(req), options)
			.pipe(
				map((res: Response) => {
					return res.json() || null;
				}),
				catchError(err => throwError(err))
			);
	}

}