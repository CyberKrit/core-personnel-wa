import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// custom imports
import { ICategories, ICategoryBrief, ICreateInduction } from '../../shared/interface/induction.interface';

@Injectable()
export class InductionService {

	// private baseURL: string = 'http://localhost:3000/';
	private baseURL: string = 'https://evening-shelf-25137.herokuapp.com/';

	constructor(
		private http: HttpClient) {}

	public listCategory(): Observable<ICategories[]> {
		const baseurl =  this.baseURL + 'api/induction-cat';

		return this.http
			.get<ICategories[]>(baseurl)
			.pipe(
				map(categories => categories),
				catchError(err => throwError(err))
			);
	}

	public createCategory(req): Observable<any> {
		
		const baseurl =  this.baseURL + 'api/induction-cat';

		return this.http
			.post(baseurl, JSON.stringify(req))
			.pipe(
				map(res => res),
				catchError(err => throwError(err))
			);
	}

	public removeCategory(catId): Observable<any> {
		const baseurl =  this.baseURL + 'api/induction-cat/' + catId;

		return this.http
			.delete(baseurl)
			.pipe(
				map(res => res),
				catchError(err => throwError(err))
			);
	}

	public updateCategory(_id, name): Observable<any> {
		const baseurl =  this.baseURL + 'api/induction-cat/';

		let buildReq = { _id, name };

		return this.http
			.put(baseurl, JSON.stringify(buildReq))
			.pipe(
				map(res => res),
				catchError(err => throwError(err))
			);
	}

	public briefCategory(): Observable<any> {
		const baseurl =  this.baseURL + 'api/induction-cat/brief';

		return this.http
			.get(baseurl)
			.pipe(
				map(res => res),
				catchError(err => throwError(err))
			);
	}

	// *** INDUCTION *** //
	public createInduction(value): Observable<any> {
		const baseUrl = this.baseURL + 'api/induction';

		return this.http
			.post<ICreateInduction>(baseUrl, JSON.stringify(value))
			.pipe(
				map(res => res),
				catchError(err => throwError(err))
			);
	}

}