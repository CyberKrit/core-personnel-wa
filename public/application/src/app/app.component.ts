import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private title = 'application';
  public collapseSidebar: boolean = false;
  public collapseSidebarWhen: number = 770;

  constructor() {
  	this.toggleSidebar(window.innerWidth);
  }

  // trigger when collapse-button is clicked
  public collapsibleSidebar() {
  	this.collapseSidebar = !this.collapseSidebar;
  }

  // trigger sidebar toggle when resized
  @HostListener('window:resize', ['$event'])
  onResize(event) {
  	this.toggleSidebar(event.target.innerWidth);
  }

  // sidebar toggle fn
  public toggleSidebar(width) {
  	this.collapseSidebar = ( width < this.collapseSidebarWhen ) ? true : false;
  }
}
