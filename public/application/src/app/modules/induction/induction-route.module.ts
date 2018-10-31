import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// custom imports
import { InductionComponent } from './induction.component';
import { InductionCategories } from './categories/induction-categories.component';
import { InductionListComp } from './list/induction-list.component';

const InductionRoutes: Routes = [
	{ 
		path: '',
		children: [
			{ path: '', component: InductionListComp },
			{ path: 'list', component: InductionListComp },
			{ path: 'create', component: InductionListComp },
			{ path: 'categories', component: InductionCategories },
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
	]
})

export class InductionRouteModule {}