import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router, Event, NavigationEnd } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material';

// component
import { EditorQuizComponent } from './editor-quiz.component';
import { ConsentBox } from '../../../shared/component/modal/consent-box';
import { ConsentSheet } from '../../../shared/component/modal/consent-sheet';

// services
import { CoreService } from '../../core/core.service';
import { InductionService } from '../induction.service';

// interface
import { IEditorResolveRes, IGenEditorPostAction } from '../../../shared/interface/induction.interface';
import { ICanDeactivateGuard } from './editor-deactivate-guard.service';

@Component({
	selector: 'editor-parent',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, ICanDeactivateGuard {
	public isPreloaded: boolean = false;
	private nativeData: IEditorResolveRes;

	// template
	private slideName: string = '';
	private templateSlugs: string[] = [
		'section', 
		'text-only', 
		'image-only', 
		'image-with-caption', 
		'image-left-content-right', 
		'image-right-content-left', 
		'content-with-3-images', 
		'video', 
		'quiz'
	];

	// saveAs
	private saveAs: boolean;
	private saveAsState: string;

	// form
	private lazy: boolean = false;

	// detect changes
	private isChanged: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private $core: CoreService,
		private $induction: InductionService,
		private router: Router,
		private consentDialog: MatDialog) {}

	public ngOnInit(): void {
		this.$core.removeProgressbar();

		this.route.data
			.subscribe(
				(resolve: Data) => {
					this.nativeData = resolve.data;
					this.runAfterInit();
				}
			);
	}

	private runAfterInit(): void {
		// slidename
		if( this.nativeData.slide !== null ) {
			this.slideName = this.nativeData.slide.name;
			this.saveAs = (this.nativeData.slide.status === 'publish') ? true : false;
		} else if ( this.nativeData.template !== null ) {
			this.slideName = this.nativeData.template.name;
			// save as published while creation of a new slide
			this.saveAs = true;
		}

		// saveAs text
		this.saveAsState = this.saveAs ? 'Publish': 'Draft';
		// page UX
		this.isPreloaded = true;
		this.$core.removeProgressbar();
	}

	// toggle textNode for saveas state
	private toggleSaveAsFn(event): void {
		this.saveAsState = event ? 'Publish': 'Draft';
	}

	// triggerSubmitFn
	private triggerSubmitFn(): void {
		this.$induction.editorFormSubmitReq();
	}

	private getFormData(formData: Observable<IGenEditorPostAction>): void {
		this.lazy = true;
		formData
			.subscribe(
				(res: IGenEditorPostAction) => {
					this.$induction.editorFormSubmitComplete();
					this.lazy = false;

					if( this.nativeData.action === 'create' ) {
						this.router.navigate(['/induction', 'editor'], {
							queryParams: {
								ind: this.nativeData.induction._id,
								tmp: this.nativeData.template._id,
								slide: res.data._id,
								action: 'update'
							}
						});
						this.nativeData.action = 'update';
						this.nativeData.slide = res.data;
						this.$core.removeProgressbar();
					}
				},
				catchError => {
					this.lazy = false;
				}
			);
	}

	private BacktoInduction(): void {
		if( this.lazy ) return;

		this.router.navigate(['/induction', 'edit', this.nativeData.induction._id]);
	}

	private detectChange(isChanged: boolean): void {
		this.isChanged = isChanged;
	}

	canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

		if( this.isChanged === true ) {

			this.consentDialog.closeAll();
			let localDialog = this.consentDialog.open(ConsentBox, {
				data: { 
					confirm: { 
						title: 'Yes, leave without saving', 
						desc: 'This action is not reversible'
					},
					cancel: { 
						title: 'Stay here', 
						desc: 'The slide is safe'
					} 
				},
				autoFocus: true,
				disableClose: true
			});

			localDialog.afterClosed()
				.subscribe(
					(state: boolean) => {
						// if false not anything neative as well as falsy
						if( state === false ) this.$core.removeProgressbar();
					}
				);

			return localDialog.afterClosed();

		}

		return of(true);
		
	}

	private removeSlide(): void {
		let inductionId, slideId;

		try {
			inductionId = this.nativeData.induction._id;
			slideId = this.nativeData.slide._id;
		} catch (err) {}

		if( !inductionId && !slideId ) return;

		let removeService = () => {
			return this.$induction.deleteSlide(inductionId, slideId);
		}

		// open modal
		this.consentDialog.closeAll();
		let localDialog = this.consentDialog.open(ConsentSheet, {
			data: { 
				confirm: { 
					title: 'Yes, delect this slide', 
					desc: 'This action is not reversible',
					fn: removeService, 
					navigate: '/induction/edit/' + this.nativeData.induction._id,
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

}