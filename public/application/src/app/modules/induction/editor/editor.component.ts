import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router, Event, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

// component
import { EditorQuizComponent } from './editor-quiz.component';

// services
import { CoreService } from '../../core/core.service';
import { InductionService } from '../induction.service';

// interface
import { IEditorResolveRes, IGenEditorPostAction } from '../../../shared/interface/induction.interface';

@Component({
	selector: 'editor-parent',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
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

	constructor(
		private route: ActivatedRoute,
		private $core: CoreService,
		private $induction: InductionService,
		private router: Router) {}

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

}