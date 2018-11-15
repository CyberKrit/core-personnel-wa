import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MediaService {

	// private baseURL: string = 'http://localhost:3000/';
	private baseURL: string = 'https://evening-shelf-25137.herokuapp.com/';

	constructor(
		private http: HttpClient) {}

	public upload(file: File): Observable<HttpEvent<{}>> {
		const baseurl =  this.baseURL + 'api/media/upload';

		const formdata: FormData = new FormData();
		formdata.append('file', file);

    return this.http.post(baseurl, formdata, {
    	reportProgress: true,
    	observe: 'events',
    	headers: new HttpHeaders().set('no-headers', 'true')
    });

	}

}