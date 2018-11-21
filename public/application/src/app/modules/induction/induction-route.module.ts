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
import { InductionTemplateComponent } from './template/induction-template.component';

// resolve
import { InductionCategoriesResolve } from './categories/induction-categories.resolve';
import { InductionCreateResolve } from './create/induction-create.resolve';
import { InductionListResolve } from './list/induction-list.resolve';
import { InductionViewResolve } from './view/induction-view.resolve';
import { InductionEditResolve } from './edit/induction-edit.resolve';
import { TemplateResolve } from './template/induction-template.resolve';
import { EditorResolve } from './editor/editor-resolve.service';

// editor
import { EditorComponent } from './editor/editor.component';

// guard
import { TemplateCanActivateGuard } from './template/induction-template.guard.service';
import { EditorCanActivateGuard } from './editor/editor-guard.service';

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
				path: 'create', 
				component: InductionCreateComponent,
				resolve: { categories: InductionCreateResolve }
			},
			{
				path: 'editor',
				component: EditorComponent,
				resolve: { data: EditorResolve },
				canActivate: [ EditorCanActivateGuard ]
			},
			{
				path: 'categories',
				component: InductionCategories,
				resolve: { categories: InductionCategoriesResolve }
			},
			{ 
				path: 'edit/:id',
				component: InductionEditComponent,
				resolve: { editData: InductionEditResolve }
			},
			{
				path: 'template/:induction',
				component: InductionTemplateComponent,
				resolve: { data: TemplateResolve },
				canActivateChild: [TemplateCanActivateGuard]
			},
			{ 
				path: ':id',
				component: InductionViewComponent,
				resolve: { inductionSingle: InductionViewResolve }
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
		// editor
		EditorResolve,
		EditorCanActivateGuard,
		// template
		TemplateResolve,
		TemplateCanActivateGuard
	]
})

export class InductionRouteModule {}