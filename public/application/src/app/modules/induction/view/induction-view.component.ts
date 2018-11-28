import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

// custom import
import { CoreService } from '../../core/core.service';
import { InductionService } from '../induction.service';
import { ISingleInductionViewData } from '../../../shared/interface/induction.interface';

@Component({
	templateUrl: './induction-view.component.html',
	styleUrls: ['./induction-view.component.scss']
})
export class InductionViewComponent implements OnInit, AfterViewChecked {
	@ViewChild('slideDeck') private slideDeck: ElementRef;
	@ViewChild('test') private test: ElementRef;

	public isPreloaded: boolean = false;
	private inductionSingleData: ISingleInductionViewData;
	private viewWidth: number;
	private styleInfo: { height: number } = { height: 0 };

	// slider
	private activeSlide = 0;
	private slideContentArr = [];

	constructor(
		private router: ActivatedRoute,
		private inductionService: InductionService,
		private coreService: CoreService,
		private el: ElementRef,
		private cd: ChangeDetectorRef) {}

	ngOnInit() {
		this.router.data
			.subscribe(
				(data: Data) => {
					this.inductionSingleData = data.inductionSingle;
					this.coreService.removeProgressbar();
					this.isPreloaded = true;

					this.inductionSingleData.slides.map(item => {
						this.slideContentArr.push(item.slide.content);
					});

					try {
						let markup = this.inductionSingleData.slides[4].slide.content;
						let doc = new DOMParser().parseFromString(markup, 'text/xml');
						let htmlDecode = doc.firstChild;
						//let el = doc.firstChild.innerHTML;
					} catch(err) {
						//console.log(err);
					}
				}
			);
	}

	ngAfterViewChecked(): void {
		// height adjustment
		try {
			if( typeof this.slideDeck.nativeElement.clientWidth === 'number' ) {
				this.viewWidth = this.slideDeck.nativeElement.clientWidth;
				this.styleInfo['height'] = this.viewWidth * 0.5625;
				this.cd.detectChanges();
			}
		} catch(err) {}

		// append content
		//console.log(this.slideContentArr);
		// console.log(typeof this.slideDeck);
		if( typeof this.slideDeck === 'object' ) {
			// var para = document.createElement('inner-wrapper-text-only');
			// var node = document.createTextNode("This is new.");
			// para.appendChild(node);
			this.slideContentArr.map((item, index) => {
				try {
					if( item ) {
						this.slideDeck.nativeElement.getElementsByClassName('slide')[index].getElementsByClassName('inner-wrapper-text-only')[0].innerHTML = item;
					}
				} catch (err) {}
			});
		}
	}

	private slideNav(dir): void {
		this.activeSlide = dir === 'next' ? ( this.activeSlide + 1 ) : ( this.activeSlide - 1 );

		if( this.activeSlide > ( this.inductionSingleData.slides.length - 1 ) )
			this.activeSlide = ( this.inductionSingleData.slides.length - 1 );

		if( this.activeSlide < 0 ) this.activeSlide = 0;
	}

}