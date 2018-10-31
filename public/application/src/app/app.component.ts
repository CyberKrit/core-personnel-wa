import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private title = 'application';
  public compactSidebar: boolean;
  public collapseSidebarWhen: number = 770;

  constructor() {}

  ngOnInit() {
    let state = window.innerWidth < this.collapseSidebarWhen ? true : false;
    this.toggleSidebar(state);
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
