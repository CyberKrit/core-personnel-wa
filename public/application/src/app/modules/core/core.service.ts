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

	// call manually
	public clientSideRippleConfig(type, client, dev) {
		type = type || 'error';
		client = client || '';
		dev = dev || '';

		let ripple = { visible: true, type, message: { client, dev } };

		this.rippleSource.next(ripple);
	}

}