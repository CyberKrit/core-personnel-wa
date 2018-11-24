import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class CoreService {
	public HOST: string = 'http://localhost:3000/';
	// public HOST: string = 'https://evening-shelf-25137.herokuapp.com/';
	
	// current state for progressbar
	private progressbarStateSource: Subject<boolean> = new Subject<boolean>();
	// observable data stream
	public progressbarState = this.progressbarStateSource.asObservable();

	// change subject value
	public removeProgressbar() {
		this.progressbarStateSource.next(true);
	}

	// enable progressbar
	public enableProgressbar() {
		this.progressbarStateSource.next(false);
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
	public startRippleInfoMsg(msg) {
		let buildData = {
			type: 'success',
			message: {
				client: msg
			}
		};

		this.rippleSource.next(buildData);
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