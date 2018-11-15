import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// create header
		let headers;
		let headerErr = {
			contentType: null,
			accept: null
		};

		try {
			if( req.headers.get('no-headers') ) throw 'noHeaders';
			
			headerErr.contentType = req.headers.get('Content-Type');
			headerErr.accept = req.headers.get('accept');
		} catch (err) {
			return next.handle(req);
		}

		// if header is allowed
		if( !headerErr.contentType && !headerErr.accept ) {
			headers = req.headers.append('Content-Type', 'application/json').append('Accept', 'application/json');
		} else if ( !headerErr.contentType ) {
			headers = req.headers.append('Content-Type', 'application/json');
		} else if ( !headerErr.accept ) {
			headers = req.headers.append('Accept', 'application/json');
		}

		// set header
		const cloneReq = req.clone({ headers });
		// return request
		return next.handle(cloneReq);
	}

}