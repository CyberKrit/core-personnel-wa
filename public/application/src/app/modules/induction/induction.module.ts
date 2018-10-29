import { NgModule } from '@angular/core';

// custom imports
import { InductionComponent } from './induction.component';
import { InductionListComp } from './list/induction-list.component';
import { InductionService } from './induction.service';
import { InductionRouteModule } from './induction-route.module';

@NgModule({
	declarations: [
		InductionComponent,
		InductionListComp
	],
	imports: [
		InductionRouteModule
	],
	providers: [
		InductionService
	]
})
export class InductionModule {}