import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// custom imports
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
	declarations: [
		HeaderComponent,
		SidebarComponent
	],
	imports: [
		RouterModule
	],
	exports: [
		HeaderComponent,
		SidebarComponent
	],
  providers: [],
})

export class CoreModule {}