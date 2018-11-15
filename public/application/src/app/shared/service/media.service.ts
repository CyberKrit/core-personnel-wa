import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// custom imports
import { CoreService } from '../../modules/core/core.service';

@Injectable()
export class MediaService {

	private baseURL: string;

	constructor(
		private http: HttpClient,
		private $core: CoreService) {
			this.baseURL = $core.HOST;
	}

	public upload(file: File): Observable<HttpEvent<any>> {
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