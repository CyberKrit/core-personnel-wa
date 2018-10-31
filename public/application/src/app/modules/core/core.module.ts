import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// custom imports
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AngularMaterialModule } from './angular-material.module';

@NgModule({
	declarations: [
		HeaderComponent,
		SidebarComponent
	],
	imports: [
		BrowserAnimationsModule,
		RouterModule,
		AngularMaterialModule
	],
	entryComponents: [
  ],
	exports: [
		HeaderComponent,
		SidebarComponent
	],
  providers: [],
})

export class CoreModule {}