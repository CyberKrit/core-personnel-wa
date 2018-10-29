import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// custom imports
import { AppComponent } from './app.component';
import { AppRouteModule } from './app-route.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRouteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
