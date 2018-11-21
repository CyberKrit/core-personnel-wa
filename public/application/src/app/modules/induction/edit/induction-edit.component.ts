import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data, Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';

// custom import
import { CoreService } from '../../core/core.service';
import { InductionService } from '../induction.service';
import { IEditInductionResolve, IGETCreateSlide, IEditInductionResolveSlideData } from '../../../shared/interface/induction.interface';
import { ConsentSheet } from '../../../shared/component/modal/consent-sheet';

@Component({
	templateUrl: './induction-edit.component.html',
	styleUrls: ['./induction-edit.component.scss']
})
export class InductionEditComponent implements OnInit, OnDestroy {
	public isPreloaded: boolean = false;
	private routeData: IEditInductionResolve;
	private navSubStream: Subscription;
	// to map reposition
	private rippleColorCustom: string = 'rgba(237, 28, 36, .05)';
	private rippleColorImport: string = 'rgba(7, 135, 208, .05)';
	private rippleColorQuiz: string = 'rgba(0, 200, 83, .05)';

	// search
	private search: string = '';

	// show slide count
	private listedSlide: number = 0;

	// slide filter
	private filterSlideStateArr: string[] = [ 'all', 'publish', 'draft'];
	private filterSlideState: string = this.filterSlideStateArr[0];

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private coreService: CoreService,
		private $induction: InductionService,
		private dialog: MatDialog) {}

	ngOnInit() {
		this.route.data
			.subscribe(
				(data: Data) => {
					this.routeData = data.editData;
console.log(this.routeData);
					// this is for search purpose only
					this.routeData.slides.map(slide => {
						slide['isVisible'] = true;
						slide['isSearched'] = true;
					});

					// count available slide on list
					this.listedSlideFn();

					this.coreService.removeProgressbar();
					this.isPreloaded = true;
				}
			);

		// reload page after getting confirmation from dialog
		this.navSubStream = this.router.events
			.subscribe(
				(event: any) => {
					if( event instanceof NavigationEnd ) {
						let { reload, dialogRes } = this.route.snapshot.queryParams;

						if( reload === 'true' && dialogRes === 'confirm' ) {
							this.$induction.EditInduction(this.routeData._id)
								.subscribe(
									(res: IEditInductionResolve) => {
										this.routeData = res;

										// this is for search purpose only
										this.routeData.slides.map(slide => {
											slide['isVisible'] = true;
											slide['isSearched'] = true;
										});

										// count available slide on list
										this.listedSlideFn();

										this.coreService.removeProgressbar();
										this.isPreloaded = true;
										try {
											this.dialog.closeAll();
										} catch (err) {}
									}
								);
						} else {
							this.coreService.removeProgressbar();
							try {
								this.dialog.closeAll();
							} catch (err) {}
						}
						
					} // endif
				} // end response
			);
	}

	private drop(event: CdkDragDrop<IEditInductionResolveSlideData[]>) {
		this.coreService.enableProgressbar();
		moveItemInArray(this.routeData.slides, event.previousIndex, event.currentIndex);
		let swapItem01 = this.routeData.slides[event.previousIndex]._id;
		let swapItem02 = this.routeData.slides[event.currentIndex]._id;
		console.log(event);
		return;
		this.$induction.reorderSlide(swapItem01, swapItem02, this.routeData._id)
			.subscribe(
				(res: Response) => {
					this.coreService.removeProgressbar();
				}
			);
	}

	private updateSlide(inductionId, templateId, slideId): void {
		this.router.navigate(
			['/induction', 'editor'], {
				queryParams: {
					ind: inductionId,
					tmp: templateId,
					slide: slideId,
					action: 'update'
				}
			}
		);
	}

	private removeSlide(slideId): void {
		let { _id } = this.routeData;
		let removeService = () => {
			return this.$induction.deleteSlide(this.routeData._id, slideId);
		}

		// open modal
		let localDialog = this.dialog.open(ConsentSheet, {
			data: { 
				confirm: { 
					title: 'Yes, delect this slide', 
					desc: 'This action is not reversible',
					fn: removeService, 
					navigate: '/induction/edit/' + _id,
					willClose: false,
				},
				cancel: { 
					title: 'Keep this slide', 
					desc: 'The slide is safe',
					fn: null, 
					navigate: null,
					willClose: true,
				} 
			},
			autoFocus: true,
			disableClose: true
		});

		localDialog.afterClosed()
			.subscribe(res => {});
	}

	private clone(slideId, index): void {
		let { _id } = this.routeData;
		let cloneService = () => {
			return this.$induction.cloneSlide(_id, slideId);
		}

		// open modal
		let localDialog = this.dialog.open(ConsentSheet, {
			data: { 
				confirm: { 
					title: 'Clone this slide',
					desc: 'You\'re about to create a duplicate slide',
					fn: cloneService, 
					navigate: '/induction/edit/' + _id,
					willClose: false,
				},
				cancel: { 
					title: 'Do not clone',
					desc: 'I\'ve changed my mind',
					fn: null, 
					navigate: null,
					willClose: true,
				} 
			},
			autoFocus: true,
			disableClose: true
		});

		localDialog.afterClosed()
			.subscribe(res => {});
	}

	private searchFn(key): void {
		let regx = new RegExp(key);

		if( !key ) {
			this.routeData.slides.map(slide => {
				slide['isSearched'] = true;
			});

			// recount listed slide
			this.listedSlideFn();
		} else {
			this.routeData.slides.map(({ name }, index) => {
				try {	
					key = key.toLowerCase();

					if( regx.test( name.toLowerCase() ) ) {
						this.routeData.slides[index]['isSearched'] = true;
					} else {
						this.routeData.slides[index]['isSearched'] = false;
					}
				} catch (err) {
					this.routeData.slides[index]['isSearched'] = false;
				}
			});

			// recount listed slide
			this.listedSlideFn();
		} // endif

	}

	private filterSlide(state): void {

		let index = this.filterSlideStateArr.indexOf(state);
		this.filterSlideState = this.filterSlideStateArr[index];

		if( this.filterSlideState === 'all' ) {
			this.routeData.slides.map(slide => {
				slide['isVisible'] = true;
			});

			// recount listed slide
			this.listedSlideFn();
		} else {
			this.routeData.slides.map((slide, index) => {
				if( this.filterSlideState === slide.status ) {
					slide['isVisible'] = true;
				} else {
					slide['isVisible'] = false;
				}
			});

			// recount listed slide
			this.listedSlideFn();
		}

	}

	private listedSlideFn(): void {
		this.listedSlide = 0;

		this.routeData.slides.map(({ isSearched, isVisible }, index) => {
			if( isSearched && isVisible ) {
				++this.listedSlide;
			}
		});
	}

	private createSlide(howToCreate: string): void {
		// pick a template
		if( howToCreate.toLowerCase() === 'custom' ) {
			this.coreService.enableProgressbar();
			this.router.navigate(['/induction', 'template', this.routeData._id], {
				queryParams: {
					action: 'create'
				}
			});
		}
	}

	ngOnDestroy(): void {
		this.navSubStream.unsubscribe();
	}

}