import { Component, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
	@Output() toggleSidebarEvent = new EventEmitter<boolean>();
	public compactSidebar: boolean = false;

	public toggleSidebar(): void {
		this.compactSidebar = !this.compactSidebar;

		this.toggleSidebarEvent.emit(this.compactSidebar);
	}

}