import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

// custom imports
import { AppComponent } from './app.component';
import { AuthGuard } from './auth-guard.service';

const AppRoute: Routes = [
	{ path: 'dashboard', loadChildren: './modules/dashboard/dashboard.module#DashboardModule' },
	{ path: 'induction', canActivate: [AuthGuard], loadChildren: './modules/induction/induction.module#InductionModule' },
	{ path: '', redirectTo: '/', pathMatch: 'full' },
	{ path: 'login', redirectTo: '/login', pathMatch: 'full' },
	{ path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
	imports: [
		RouterModule.forRoot(AppRoute, { preloadingStrategy: PreloadAllModules })
	],
	exports: [
		RouterModule
	],
	providers: [
		AuthGuard
	]
})

export class AppRouteModule {}