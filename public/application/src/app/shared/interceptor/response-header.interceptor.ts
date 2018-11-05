import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

// custom imports
import { CoreService } from '../../modules/core/core.service';

@Injectable()
export class ResponseHeaderInterceptor implements HttpInterceptor {

	constructor(
		private coreService: CoreService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(req).pipe(
				tap(
					event => {
						if( event instanceof HttpResponse ) {
							try {
								const decodeMessage = JSON.parse(event.statusText);

								let { visible, type, client, dev } = decodeMessage;
								let { status } = event;

								let buildRipple = { status, type, message: { client, dev }, visible };
								this.coreService.startRipple(buildRipple);
							} catch (err) {}
							
						}
					}
				), // tap
				catchError(err => {
					this.coreService.clientSideRippleConfig('error', 'Action failed! Please try again', '');
					return throwError(err);
				})
			);
	}

}