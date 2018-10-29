import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// custom imports
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';
import { DashboardRouteModule } from './dashboard-route.module';

@NgModule({
	declarations: [
		DashboardComponent
	],
	imports: [
		CommonModule,
		DashboardRouteModule
	],
	providers: [
		DashboardService
	]
})

export class DashboardModule {}