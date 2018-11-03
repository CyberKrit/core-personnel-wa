import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// custom imports
import { InductionComponent } from './induction.component';
import { InductionCategories } from './categories/induction-categories.component';
import { InductionListComp } from './list/induction-list.component';
import { InductionCreateComponent } from './create/induction-create.component';

// resolve
import { InductionCategoriesResolve } from './categories/induction-categories.resolve';
import { InductionCreateResolve } from './create/induction-create.resolve';

const InductionRoutes: Routes = [
	{ 
		path: '',
		children: [
			{ path: '', component: InductionListComp },
			{ path: 'list', component: InductionListComp },
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
		InductionCreateResolve
	]
})

export class InductionRouteModule {}