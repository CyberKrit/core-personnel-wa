import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Data } from '@angular/router';

// custom import
import { InductionService } from '../induction.service';
import { InductionListComp } from '../list/induction-list.component';
import { CoreService } from '../../core/core.service';
import { ICategories } from '../../../shared/interface/induction.interface';
import { ConsentBox } from '../../../shared/component/modal/consent-box';
import { PromptBox } from '../../../shared/component/modal/prompt-box';


@Component({
	selector: 'induction-categories',
	templateUrl: './induction-categories.component.html',
	styleUrls: ['./induction-categories.component.scss']
})

export class InductionCategories implements OnInit {
	// preloaded
	isPreloaded: boolean = false;
	// target add category submit button for styling
	@ViewChild('createCatFormActionBtn') createCatFormActionBtn: ElementRef;
	@ViewChild('trgtCatName') trgtCatName: ElementRef;
	// list of categories
	public categories: Array<ICategories>;
	// check whether category form was submitted
	public createCatFormSubmit: boolean = false;
	public catNameDefaultVal: string = '';

	constructor(
		public inductionService: InductionService,
		public dialog: MatDialog,
		public route: ActivatedRoute,
		private coreService: CoreService) {}

	ngOnInit() {
		this.route.data
			.subscribe((res: Data) => {
				this.categories = res.categories;
				this.categories.map(item => { item['highlight'] = { update: false, delete: false } });
				this.isPreloaded = true;
				// deactivate progressbar
				this.coreService.removeProgressbar();
			});
	}

	public addCategoryForm(createCatForm: NgForm) {
		if( !createCatForm.valid ) {
			this.trgtCatName.nativeElement.focus();
			this.trgtCatName.nativeElement.blur();
			return;
		}

		// focusout active input. this way when enter to submit the field won't be highlighted
		this.trgtCatName.nativeElement.blur();
		// change button visual state to busy
		this.createCatFormActionBtn.nativeElement.classList.add('_busy_');
		// disable button from template
		this.createCatFormSubmit = true;

		let { newCategoryName } = createCatForm.value;
		let slug = newCategoryName.toString().toLowerCase()
								.replace(/\s+/g, '-')           // Replace spaces with -
						    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
						    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
						    .replace(/^-+/, '')             // Trim - from start of text
						    .replace(/-+$/, '');            // Trim - from end of text

		const req = {
			name: newCategoryName.trim(),
			slug
		};

		this.inductionService.createCategory(req)
			.subscribe(
				(res) => {
					// change button visual state to idle
					this.createCatFormActionBtn.nativeElement.classList.remove('_busy_');
					// disable button from template
					this.createCatFormSubmit = false;
					// reset category name input value
					createCatForm.reset();
					// repopulate category list
					this.listCat();
				},
				(err) => console.log(err)
			);

	} // addCategoryForm

	listCat() {
		this.inductionService.listCategory()
			.subscribe(
				(res: Array<any>)  => {
					this.categories = res;
					this.categories.map(item => { item['highlight'] = { update: false, delete: false } });
				});
	}

	public removeItem(id) {
		let dialogRef = this.dialog.open(ConsentBox, {
			data: { id, title: 'Are you sure you want to delete this file?' }
		});

		let deleteItemIndex: number = 0;
		this.categories.map(({ _id }, index) => {
			if ( _id.toString() === id.toString() ) deleteItemIndex = index;
		});
		this.categories[deleteItemIndex].highlight.delete = true;

		dialogRef.afterClosed()
			.subscribe(
				(res) => {
					this.categories[deleteItemIndex].highlight.delete = false;

					if( res ) {
						this.categories.splice(deleteItemIndex, 1);
					} else if( res === undefined ) {
						this.coreService.clientSideRippleConfig('error', 'Category deletion failed. Try again!', '');
					}
				}
			);
	}

	public updateItem(id, fieldValue) {
		let dialogRef = this.dialog.open(PromptBox, {
			data: { id, fieldValue, title: 'Enter a new name for this category' }
		});

		let updateItemIndex: number = 0;
		this.categories.map(({ _id }, index) => {
			if ( _id.toString() === id.toString() ) updateItemIndex = index;
		});
		this.categories[updateItemIndex].highlight.update = true;

		dialogRef.afterClosed()
			.subscribe(res => {
				this.categories[updateItemIndex].highlight.update = false;
				
				if( res ) {
					this.categories[updateItemIndex].name = res;
				} else if( res === undefined ) {
					this.coreService.clientSideRippleConfig('error', 'Category update failed. Try again!', '');
				}
			});
	}

}