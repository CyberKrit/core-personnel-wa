import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	template: ``
})

export class LoginComp implements OnInit {

	constructor(
		private router: Router) {}

	ngOnInit(): void {
		this.router.navigate(['/login']);
		window.location.reload();
	}

}