import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class InductionService {

	private headers: Headers;
	private options: RequestOptions;
	// private baseURL: string = 'http://localhost:3000/';
	private baseURL: string = 'https://evening-shelf-25137.herokuapp.com/';

	constructor(
		private http: Http) {
			this.headers = new Headers({ 
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			});
			this.options = new RequestOptions({ headers: this.headers });
	}

	public listCategory(): Observable<any> {
		const baseurl =  this.baseURL + 'api/induction-cat';

		return this.http
			.get(baseurl, this.options)
			.pipe(
				map((res: Response) => {
					return res.json() || null;
				}),
				catchError(err => throwError(err))
			);
	}

	public createCategory(req): Observable<any> {
		
		const baseurl =  this.baseURL + 'api/induction-cat';

		return this.http
			.post(baseurl, JSON.stringify(req), this.options)
			.pipe(
				map((res: Response) => {
					return res.json() || null;
				}),
				catchError(err => throwError(err))
			);
	}

	public removeCategory(catId): Observable<any> {
		const baseurl =  this.baseURL + 'api/induction-cat/' + catId;

		return this.http
			.delete(baseurl, this.options)
			.pipe(
				map((res: Response) => {
					return res.json() || null;
				}),
				catchError(err => throwError(err))
			);
	}

	public updateCategory(_id, name): Observable<any> {
		const baseurl =  this.baseURL + 'api/induction-cat/';

		let buildReq = { _id, name };

		return this.http
			.put(baseurl, JSON.stringify(buildReq), this.options)
			.pipe(
				map((res: Response) => {
					return res.json() || null;
				}),
				catchError(err => throwError(err))
			);
	}

	public briefCategory(): Observable<any> {
		const baseurl =  this.baseURL + 'api/induction-cat/brief';

		return this.http
			.get(baseurl, this.options)
			.pipe(
				map((res: Response) => {
					return res.json() || null;
				}),
				catchError(err => throwError(err))
			);
	}

}