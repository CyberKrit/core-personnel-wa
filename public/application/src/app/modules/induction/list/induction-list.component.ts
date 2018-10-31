import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
	selector: 'induction-list',
	templateUrl: './induction-list.component.html',
	styleUrls: ['./induction-list.component.scss']
})
export class InductionListComp {
	@ViewChild('btnDropDown') btnDropDown: ElementRef;
	@ViewChild('btnDropDownList') btnDropDownList: ElementRef;
	title: string = 'Induction';
	private btnDropDownActive: boolean = false;

	constructor() {}

	public btnDropDownEvt(el) {
		// toggle active state
		this.btnDropDownActive = !this.btnDropDownActive;

		if( this.btnDropDownActive ) {
			// active style for button
			el.classList.add('_active_');
			// active style for list
			this.btnDropDownList.nativeElement.classList.add('_show_');
		} else {
			// idle state for button
			el.classList.remove('_active_');
			// hide list
			this.btnDropDownList.nativeElement.classList.remove('_show_');
		}
	}

	@HostListener('document:click', ['$event.target']) 
	public onClick(el) {
		// target parent element
		let button = this.btnDropDown.nativeElement;
		// close button active mode when clicked outside
		if (button !== el && !button.contains(el)) {
	    this.btnDropDownActive = false;
			// idle state for button
			this.btnDropDown.nativeElement.classList.remove('_active_');
			// hide list
			this.btnDropDownList.nativeElement.classList.remove('_show_');
	  }
	}

}