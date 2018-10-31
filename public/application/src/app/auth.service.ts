import { Injectable } from '@angular/core';

@Injectable()

export class AuthService {
	private auth: boolean = !false;

	public isAuthenticated(): Promise<boolean> {
		return new Promise(( resolve, reject ) => {
			if( !this.auth ) reject();

			resolve(this.auth);
		});
	}

}