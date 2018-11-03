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
}