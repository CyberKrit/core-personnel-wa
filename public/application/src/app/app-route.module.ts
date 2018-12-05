import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

// custom imports
import { AppComponent } from './app.component';
import { AppAuthCanctivate } from './app-auth.canActivate';
import { LoginComp } from './modules/user/login/login.comp';

const AppRoute: Routes = [
	{ 
		path: 'dashboard',
		loadChildren: './modules/dashboard/dashboard.module#DashboardModule',
		canActivate: [ AppAuthCanctivate ]
	},
	{ 
		path: 'induction',
		loadChildren: './modules/induction/induction.module#InductionModule',
		canActivate: [ AppAuthCanctivate ]
	},
	{ 
		path: 'account',
		loadChildren: './modules/user/profile/profile.module#ProfileModule',
		canActivate: [ AppAuthCanctivate ]
	},
	{ 
		path: 'invitee',
		loadChildren: './modules/user/invitee/invitee.module#InviteeModule',
		canActivate: [ AppAuthCanctivate ]
	},
	{ 
		path: 'company',
		loadChildren: './modules/company/company.module#CompanyModule',
		canActivate: [ AppAuthCanctivate ]
	},
	{ 
		path: 'login',
		component: LoginComp
	},
	{ 
		path: '**', 
		redirectTo: '/dashboard', 
		pathMatch: 'full'
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(AppRoute, 
			{ 
				preloadingStrategy: PreloadAllModules,
				onSameUrlNavigation: 'reload'
			})
	],
	exports: [
		RouterModule
	],
	providers: [ AppAuthCanctivate ]
})

export class AppRouteModule {}