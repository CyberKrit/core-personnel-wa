import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// custom imports
import { InductionComponent } from './induction.component';
import { InductionCategories } from './categories/induction-categories.component';
import { InductionListComp } from './list/induction-list.component';
import { InductionCreateComponent } from './create/induction-create.component';
import { InductionViewComponent } from './view/induction-view.component';
import { InductionEditComponent } from './edit/induction-edit.component';
import { inductionSingleComponent } from './single/induction-single.component';

// resolve
import { InductionCategoriesResolve } from './categories/induction-categories.resolve';
import { InductionCreateResolve } from './create/induction-create.resolve';
import { InductionListResolve } from './list/induction-list.resolve';
import { InductionViewResolve } from './view/induction-view.resolve';
import { InductionEditResolve } from './edit/induction-edit.resolve';
import { InductionSingleResolve } from './single/induction-single.resolve';

const InductionRoutes: Routes = [
	{ 
		path: '',
		children: [
			{ 
				path: '', 
				component: InductionListComp,
				resolve: { inductions: InductionListResolve }
			},
			{ 
				path: ':id',
				component: InductionViewComponent,
				resolve: { inductionSingle: InductionViewResolve }
			},
			{ 
				path: 'edit/:id',
				component: InductionEditComponent,
				resolve: { editData: InductionEditResolve }
			},
			{ 
				path: 'single/:induction',
				component: inductionSingleComponent,
				resolve: { singleData: InductionSingleResolve }
			},
			{
				path: 'create', 
				component: InductionCreateComponent,
				resolve: { categories: InductionCreateResolve }
			},
			{
				path: 'categories',
				component: InductionCategories,
				resolve: { categories: InductionCategoriesResolve }
			},
			{ path: '**', redirectTo: '/induction', pathMatch: 'full' }
		] 
	}
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(InductionRoutes)
	],
	exports: [
		RouterModule
	],
	providers: [
		InductionCategoriesResolve,
		InductionCreateResolve,
		InductionListResolve,
		InductionViewResolve,
		InductionEditResolve,
		InductionSingleResolve
	]
})

export class InductionRouteModule {}