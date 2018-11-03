import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

// custom imports
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AngularMaterialModule } from './angular-material.module';
import { InductionService } from '../induction/induction.service';
import { CoreService } from './core.service';
import { ConsentBox } from '../../shared/component/modal/consent-box';
import { PromptBox } from '../../shared/component/modal/prompt-box';

@NgModule({
	declarations: [
		HeaderComponent,
		SidebarComponent,
		ConsentBox,
		PromptBox
	],
	imports: [
		BrowserAnimationsModule,
		HttpModule,
		RouterModule,
		FormsModule,
		AngularMaterialModule
	],
	entryComponents: [
		ConsentBox,
		PromptBox
  ],
	exports: [
		HeaderComponent,
		SidebarComponent,
		AngularMaterialModule
	],
	providers: [
		CoreService,
		InductionService
	]
})

export class CoreModule {}