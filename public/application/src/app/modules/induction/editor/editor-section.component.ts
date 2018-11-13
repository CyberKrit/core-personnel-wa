import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Routes } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

// custom imports
import { FormService } from '../../../shared/service/form.service';
import { InductionService } from '../induction.service';
import { IInductionSingleResolve } from '../../../shared/interface/induction.interface';
import { ConsentSheet } from '../../../shared/component/modal/consent-sheet';

@Component({
	selector: 'editor-section',
	template: `
		<form novalidate autocomplete="false" [formGroup]="sectionForm" (ngSubmit)="formSubmit(sectionForm)">
			<div class="comp-aside _clr_">
				<div class="_end_">
					<span class="save-as-text">{{ saveAs }}</span> <mat-slide-toggle formControlName="publish"></mat-slide-toggle>
				</div>
				<div class="comp-aside_meta">
					<ul class="_clr_">
						<li><a [routerLink]="['/induction/edit/' + inductionData?._id]">{{ inductionData?.name }}</a></li>
						<li>{{ slideTitle }}</li>
					</ul>
				</div>
			</div>

			<div class="_editor-section_">
				<div class="control-wrapper">
					<label for="sectionTitle">Section title</label>
					<input type="text" id="sectionTitle" formControlName="sectionTitle">
					<ul class="err-list" *ngIf="sectionForm.get('sectionTitle').touched">
						<li class="err-item" 
							*ngIf="sectionForm.get('sectionTitle').errors?.required">
							This field is required
						</li>
						<li class="err-item" 
							*ngIf="sectionForm.get('sectionTitle').errors?.AlphaNumericSpaceErr">
							This input must contain only letters, numbers, and spaces.
						</li>
					</ul>
				</div>

				<div class="form-interaction _clr_">
					<button mat-mini-fab type="button" (click)=removeSlide()>
				    <mat-icon aria-label="discard slide">delete_outline</mat-icon>
				  </button>
					<button class="primary-action-btn" type="submit" [disabled]="lazyForm">
						<span class="idle" *ngIf="!lazyForm">Save Slide</span>
						<span class="lazy" *ngIf="lazyForm">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-dual-ring" style="animation-play-state:running;animation-delay:0s;background:0 0"><circle cx="50" cy="50" fill="none" stroke-linecap="round" r="40" stroke-width="8" stroke="#fff" stroke-dasharray="62.83185307179586 62.83185307179586" transform="rotate(288.79 50 50)" style="animation-play-state:running;animation-delay:0s"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"/></circle></svg>
						</span>
					</button>
					<div class="complementary-btn-grp">
						<button class="preview-btn" type="button">
							<span class="idle">Preview</span>
						</button>
					</div>
				</div>
			</div>
		</form>
	`,
	styleUrls: ['./editor.component.scss']
})
export class EditorSectionComponent implements OnInit {
	public sectionForm: FormGroup;
	private saveAsOptions: string[] = [ 'Draft', 'Publish' ];
	public saveAs: string = this.saveAsOptions[1];
	public lazyForm: boolean = false;

	@Input('inductionData') public inductionData: IInductionSingleResolve;
	@Input('slideTitle') public slideTitle: string;
	@Input('variation') public variation: string;

	constructor(
		private fb: FormBuilder,
		private $form: FormService,
		private $induction: InductionService,
		private dialog: MatDialog) {}

	ngOnInit() {
		let { header, status } = this.inductionData.slide;
		let publishData: boolean = ( status === 'publish' ) ? true : false;

		this.sectionForm = this.fb.group({
			sectionTitle: [header, [Validators.required, this.$form.safeString]],
			publish: [publishData]
		});

		this.sectionForm.get('publish').valueChanges
			.subscribe(
				value => {
					if( value ) {
						this.saveAs = this.saveAsOptions[1];
					} else {
						this.saveAs = this.saveAsOptions[0];
					}
				}
			);

	}

	public removeSlide(): void {
		// remove fn
		let { _id } = this.inductionData;
		let slideId = this.inductionData.slide._id;
		let removeService = () => {
			return this.$induction.deleteSlide(_id, slideId);
		}

		// open modal
		let localDialog = this.dialog.open(ConsentSheet, {
			data: { 
				confirm: { 
					title: 'Yes, delect this slide', 
					desc: 'This action is not reversible',
					fn: removeService, 
					navigate: '/induction/edit/' + _id
				},
				cancel: { 
					title: 'Keep this slide', 
					desc: 'The slide is safe',
					fn: null, 
					navigate: null 
				} 
			},
			autoFocus: true,
			disableClose: true
		});

		localDialog.afterClosed()
			.subscribe(
				(res) => {
					console.log(res);
				}
			);
	}

	public formSubmit({ value, valid }: { value: any, valid: boolean }): void {
		if( valid && !this.lazyForm ) {
			let filteredValue = this.$form.whiteSpaceControl(value);

			this.sectionForm.disable();
			this.lazyForm = true;

			// build req object
			let isPublished = ( filteredValue.publish ) ? 'publish' : 'draft';

			let buildReq = {
				inductionId: this.inductionData._id,
				slideIndex: this.inductionData.slideIndex,
				slideData: {
					template: this.inductionData._id,
					name: this.slideTitle,
					variation: this.variation,
					header: filteredValue.sectionTitle,
					status: isPublished
				}
			};

			this.$induction.update(buildReq)
				.subscribe(
					(res: Response) => {
						this.sectionForm.enable();
						this.lazyForm = false;
					}
				);
		} else {
			this.sectionForm.get('sectionTitle').markAsTouched();
		}
	}

}