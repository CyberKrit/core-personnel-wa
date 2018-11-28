import { Component, ViewChild, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Data, NavigationEnd, NavigationStart, RouterEvent } from '@angular/router';
 import * as html2canvas from 'html2canvas';

// custom imports
import { CoreService } from '../../core/core.service';
import { IListInduction } from '../../../shared/interface/induction.interface';

@Component({
	selector: 'induction-list',
	templateUrl: './induction-list.component.html',
	styleUrls: ['./induction-list.component.scss']
})
export class InductionListComp implements OnInit {
	private startURL: string;
	private endURL: string;

	@ViewChild('btnDropDown') btnDropDown: ElementRef;
	@ViewChild('btnDropDownList') btnDropDownList: ElementRef;
	title: string = 'Induction';
	private btnDropDownActive: boolean = false;

	private inductionList: IListInduction[];
	public isPreloaded: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private coreService: CoreService,
		private router: Router) {}

	ngOnInit() {

		this.router.events
			.subscribe(
				(event: RouterEvent) => {
					if( event instanceof NavigationStart ) {
						this.startURL = event.url.toString();
					}
					if( event instanceof NavigationEnd ) {
						this.endURL = event.url.toString();
						this.completeProgressbar();
					}
				}
			);

		this.route.data
			.subscribe(
				(res: Data) => {
					this.inductionList = res.inductions;
					this.isPreloaded = true;
					this.coreService.removeProgressbar();
				}
			);

	}

	private completeProgressbar(): void {
		if( this.startURL && this.endURL && this.startURL === this.endURL ) {
			this.coreService.removeProgressbar();
		}
	}

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

	abc() {
		html2canvas( document.querySelector('#testDiv') )
    .then(canvas => {
    	let savedCanvas = canvas;
    	document.body.appendChild(canvas);

    	//Canvas2Image.saveAsPNG(canvas);
      console.log(document.querySelector('canvas').toDataURL());
    })
    .catch(err => {
      console.log("error canvas", err);
    });
	}

}