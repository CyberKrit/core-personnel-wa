import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

// custom imports
import { CoreService } from '../../modules/core/core.service';

@Injectable()
export class ResponseHeaderInterceptor implements HttpInterceptor {

	constructor(
		private coreService: CoreService,
		private router: Router) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(req).pipe(
				tap(
					event => {
						if( event instanceof HttpResponse ) {
							this.parseRippleRawData(event.statusText, event);
						}
					}
				), // tap
				catchError(err => {
					try {
						// auto fail from server
						this.parseRippleRawData(err.error.data.statusMessage, null);
					} catch (err) {
						// manually fail from client
						this.coreService.startRippleGeneric();
					}
					this.coreService.removeProgressbar();
					if (err.status) {
						// this.router.navigate(['/login']);
					}
					return throwError(err);
				})
			);
	}

	parseRippleRawData(statusText, event) {
		try {
			const decodeMessage = JSON.parse(statusText);

			let { visible, type, client, dev } = decodeMessage;
			let status = 500;

			try {
				status = event.status || 500;
			} catch (err) {}

			let buildRipple = { status, type, message: { client, dev }, visible };
			this.coreService.startRipple(buildRipple);
		} catch (err) {}
	}

}