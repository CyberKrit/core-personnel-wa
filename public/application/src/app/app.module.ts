import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// custom imports
import { AppComponent } from './app.component';
import { AppRouteModule } from './app-route.module';
import { CoreModule } from './modules/core/core.module';
import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRouteModule,
    CoreModule
  ],
  providers: [ AuthGuard, AuthService ],
  bootstrap: [AppComponent]
})
export class AppModule {}
