import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class CoreService {
	// current state for progressbar
	private progressbarStateSource: Subject<boolean> = new Subject<boolean>();
	// observable data stream
	public progressbarState = this.progressbarStateSource.asObservable();

	// change subject value
	public removeProgressbar() {
		this.progressbarStateSource.next(true);
	}

	// *** RIPPLE *** 
	private rippleSource: Subject<any> = new Subject<any>();
	public ripple$ = this.rippleSource.asObservable();

	// call from http interceptor automatically
	public startRipple(ripple) {
		if( !ripple.visible ) return;

		this.rippleSource.next(ripple);
	}

	// generic error
	public startRippleCustomMsg(msg) {
		let buildData = {
			type: 'error',
			message: {
				client: msg
			}
		};

		this.rippleSource.next(buildData);
	}

	// generic error
	public startRippleGeneric() {
		let buildData = {
			type: 'error',
			message: {
				client: 'Action failed, try again please!'
			}
		};

		this.rippleSource.next(buildData);
	}

}