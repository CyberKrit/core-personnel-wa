import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// create header
		const headers = req.headers.set('Content-Type', 'application/json').append('Accept', 'application/json');
		
		// set header
		const cloneReq = req.clone({ headers });
		// return request
		return next.handle(cloneReq);
	}

}