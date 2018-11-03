import { Component, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import { CoreService } from './modules/core/core.service';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isProgressBarActive: boolean;
  private title = 'application';
  public compactSidebar: boolean;
  public collapseSidebarWhen: number = 770;
  private subscription: Subscription;

  constructor(
    private coreService: CoreService,
    private router: Router,
    private cd: ChangeDetectorRef) {

    // show progressbar on every route change attempt
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((event:NavigationStart) => {
        if( event ) this.isProgressBarActive = true;
      });

  }

  ngOnInit() {
    let state = window.innerWidth < this.collapseSidebarWhen ? true : false;
    this.toggleSidebar(state);

    // remove progressbar when true
    this.coreService.progressbarState
      .subscribe((state: boolean) => {
        if( state ) this.isProgressBarActive = false;
        this.cd.detectChanges();
      });
  }

  toggleSidebar(res: boolean): void {
    this.compactSidebar = res;
  }

  // trigger sidebar toggle when resized
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let state = event.target.innerWidth < this.collapseSidebarWhen ? true : false;
    this.toggleSidebar(state);
  }
}
