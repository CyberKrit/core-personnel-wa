import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// custom imports
import { InductionComponent } from './induction.component';
import { InductionCategories } from './categories/induction-categories.component';
import { InductionListComp } from './list/induction-list.component';
import { InductionCreateComponent } from './create/induction-create.component';
import { InductionSingleViewComponent } from './single-view/induction-single-view.component';
import { InductionSingleEditComponent } from './single-edit/induction-single-edit.component';

// resolve
import { InductionCategoriesResolve } from './categories/induction-categories.resolve';
import { InductionCreateResolve } from './create/induction-create.resolve';
import { InductionListResolve } from './list/induction-list.resolve';
import { InductionSingleViewResolve } from './single-view/induction-single-view.resolve';

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
				component: InductionSingleViewComponent,
				resolve: { inductionSingle: InductionSingleViewResolve }
			},
			{ 
				path: 'edit/:id',
				component: InductionSingleEditComponent,
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
		InductionSingleViewResolve
	]
})

export class InductionRouteModule {}