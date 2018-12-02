import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import * as localForage from 'localforage';

// custom imports
import { CoreService } from '../core.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
	@Output() toggleSidebarEvent = new EventEmitter<boolean>();
	public compactSidebar: boolean = false;

	constructor(
		private $core: CoreService,
		private router: Router) {}

	public toggleSidebar(): void {
		this.compactSidebar = !this.compactSidebar;

		this.toggleSidebarEvent.emit(this.compactSidebar);
	}

	public userNav(): void {
		console.log('userNav');
	}

	public logout(): void {
		this.$core.setToken('');
		localForage.clear()
			.then(() => {
				this.router.navigate(['/login']);
			});
	}

	public viewProfile(): void {
		this.router.navigate(['/account']);
	}

}