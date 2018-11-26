import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// custom imports
import { AppComponent } from './app.component';
import { AppRouteModule } from './app-route.module';
import { CoreModule } from './modules/core/core.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRouteModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
