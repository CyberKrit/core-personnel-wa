import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// custom imports
import { InductionComponent } from './induction.component';
import { InductionCategories } from './categories/induction-categories.component';
import { InductionListComp } from './list/induction-list.component';
import { InductionCreateComponent } from './create/induction-create.component';
import { InductionService } from './induction.service';
import { InductionRouteModule } from './induction-route.module';
import { AngularMaterialModule } from '../core/angular-material.module';

@NgModule({
	declarations: [
		InductionComponent,
		InductionListComp,
		InductionCategories,
		InductionCreateComponent
	],
	imports: [
		CommonModule,
		InductionRouteModule,
		HttpModule,
		FormsModule,
		ReactiveFormsModule,
		AngularMaterialModule
	],
	providers: [
		InductionService
	]
})
export class InductionModule {}