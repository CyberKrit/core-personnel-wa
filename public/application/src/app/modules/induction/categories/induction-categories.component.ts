import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';

// custom import
import { InductionService } from '../induction.service';
import { InductionListComp } from '../list/induction-list.component';
import { ConsentBox } from '../../../shared/component/modal/consent-box';
import { PromptBox } from '../../../shared/component/modal/prompt-box';


@Component({
	selector: 'induction-categories',
	templateUrl: './induction-categories.component.html',
	styleUrls: ['./induction-categories.component.scss']
})

export class InductionCategories implements OnInit {
	@ViewChild('createCatFormActionBtn') createCatFormActionBtn: ElementRef;
	public categories: Array<any> = [];
	public createCatFormSubmit: boolean = false;
	public catNameDefaultVal: string = '';

	constructor(
		public inductionService: InductionService,
		public dialog: MatDialog) {}

	ngOnInit() {
		this.listCat();
	}

	public addCategoryForm(createCatForm: NgForm) {
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
	}

	listCat() {
		this.inductionService.listCategory()
			.subscribe(
				(res: Array<any>)  => {
					this.categories = res;
					this.categories.map(item => { item['highlight'] = { update: false, delete: false } });
				},
				(err) => console.error(err)
			);
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
			.subscribe(res => {
				if( res ) {
					this.categories.splice(deleteItemIndex, 1);
				} else {
					this.categories[deleteItemIndex].highlight.delete = false;
				}
			});
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
			.subscribe(res => {console.log(res);
				if( res ) {
					this.categories[updateItemIndex].highlight.update = false;
					this.categories[updateItemIndex].name = res;
				}
			});
	}

}