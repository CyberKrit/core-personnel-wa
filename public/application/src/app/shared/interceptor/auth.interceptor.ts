import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';

// custom imports
import { CoreService } from '../../modules/core/core.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	private token: string | null = null;

	constructor(
		private $core: CoreService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// create header
		let headers;
		let headerErr = {
			contentType: null,
			accept: null
		};

		this.token = this.$core.getToken() || '';

		try {
			if( req.headers.get('no-headers') ) throw 'noHeaders';
			
			headerErr.contentType = req.headers.get('Content-Type');
			headerErr.accept = req.headers.get('accept');
		} catch (err) {
			return next.handle(req);
		}

		// if header is allowed
		if( !headerErr.contentType && !headerErr.accept ) {
			headers = req.headers.append('Content-Type', 'application/json').append('Accept', 'application/json').append('x-auth', this.token);
		} else if ( !headerErr.contentType ) {
			headers = req.headers.append('Content-Type', 'application/json').append('x-auth', this.token);
		} else if ( !headerErr.accept ) {
			headers = req.headers.append('Accept', 'application/json').append('x-auth', this.token);
		}

		// set header
		const cloneReq = req.clone({ headers });
		// return request
		return next.handle(cloneReq);
	}

}