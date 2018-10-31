import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

// custom imports
import { InductionComponent } from './induction.component';
import { InductionCategories } from './categories/induction-categories.component';
import { InductionListComp } from './list/induction-list.component';
import { InductionService } from './induction.service';
import { InductionRouteModule } from './induction-route.module';

@NgModule({
	declarations: [
		InductionComponent,
		InductionListComp,
		InductionCategories
	],
	imports: [
		CommonModule,
		InductionRouteModule,
		HttpModule,
		FormsModule
	],
	providers: [
		InductionService
	]
})
export class InductionModule {}