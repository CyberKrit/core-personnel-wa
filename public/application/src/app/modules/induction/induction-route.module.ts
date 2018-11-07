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

// resolve
import { InductionCategoriesResolve } from './categories/induction-categories.resolve';
import { InductionCreateResolve } from './create/induction-create.resolve';
import { InductionListResolve } from './list/induction-list.resolve';
import { InductionViewResolve } from './view/induction-view.resolve';
import { InductionEditResolve } from './edit/induction-edit.resolve';

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
				path: 'view/:id',
				component: InductionViewComponent,
				resolve: { inductionSingle: InductionViewResolve }
			},
			{ 
				path: 'edit/:id',
				component: InductionEditComponent,
				resolve: { editData: InductionEditResolve }
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
		InductionEditResolve
	]
})

export class InductionRouteModule {}