import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Data, RouterEvent, NavigationEnd } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

// custom imports
import { FormService } from '../../../shared/service/form.service';
import { CoreService } from '../../core/core.service';
import { ProfileService } from './profile.service';

@Component({
	templateUrl: './profile.comp.html',
	styleUrls: ['./profile.comp.scss']
})
export class ProfileComponent implements OnInit {
	public isPreloaded: boolean = false;
	private userData: any;

	// form
	private isLazy: boolean = false;
	private profileForm: FormGroup;
	private formValCompany: string | null = null;
	private formValFirstname: string | null = null;
	private formValLastname: string | null = null;
	private formValEmail: string | null = null;
	private formCurrentPwdRequired: boolean = false;
	private errOldPwdMinLen: boolean = false;
	private errNewPwdMinLen: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private $core: CoreService,
		private fb: FormBuilder,
		private $form: FormService,
		private $profile: ProfileService) {}

	ngOnInit(): void {
		// for same page
		this.router.events
			.subscribe(
				(event: RouterEvent) => {
					if( event instanceof NavigationEnd ) {
						this.$core.removeProgressbar();
					}
				}
			);

		// load data
		this.route.data
			.subscribe(
				(res: Data) => {
					this.userData = res.data.data;
					this.$core.removeProgressbar();
					this.isPreloaded = true;

					// fill formdata
					try {
						this.formValCompany = this.userData.company[0].name;
						if( this.userData.personal.length ) {
							this.formValFirstname = this.userData.personal[0].firstname;
							this.formValLastname = this.userData.personal[0].lastname;
						}
						this.formValEmail = this.userData.email;
					} catch (err) {}
					console.log(this.userData);
				}
			);

		// create form
		this.profileForm = this.fb.group({
			companyName: [this.formValCompany, [Validators.required]],
			firstName: [this.formValFirstname, [Validators.required]],
			lastName: [this.formValLastname, [Validators.required]],
			email: [this.formValEmail, [Validators.required]],
			currentPwd: [null],
			newPwd: [null]
		});

		this.profileForm.get('currentPwd').valueChanges
			.subscribe(
				(value: string) => {
					if( value ) {
						this.formCurrentPwdRequired = false;

						if( value.length >= 8 ) {
							this.errOldPwdMinLen = false;
						}
					}
					
				}
			);

	}

	private formSubmit({ value, valid }: { value: any, valid: boolean }): void {
		if( valid ) {
			if( this.profileForm.get('newPwd').value ) {
				if( this.profileForm.get('newPwd').value.length < 8 ) {
					this.errNewPwdMinLen = true;
				} else {
					this.errNewPwdMinLen = false;
					let currentPwd: string = this.profileForm.get('currentPwd').value;

					if( !currentPwd ) {
						this.formCurrentPwdRequired = true;
					} else {
						this.formCurrentPwdRequired = false;
						if( this.profileForm.get('currentPwd').value.length < 8 ) {
							this.errOldPwdMinLen = true;
						} else {
							this.sendData(value);
						}

					}
				}
			} else {
				this.sendData(value);
			}

		} else {
			this.isLazy = false;
			this.profileForm.enable();
			this.profileForm.get('companyName').markAsTouched();
			this.profileForm.get('firstName').markAsTouched();
			this.profileForm.get('lastName').markAsTouched();
			this.profileForm.get('email').markAsTouched();
		}
	}

	private sendData(value): void {
		this.profileForm.disable();
		this.isLazy = true;
		let formData = this.$form.whiteSpaceControl(value);

		// submit form
		this.$profile.updateUser(formData)
			.subscribe(
				(res: any) => {
					this.userData = res.data;
					this.profileForm.enable();
					this.isLazy = false;

					if( res.status === true ) {
						// reset form input accroding to updated data
						this.profileForm.get('companyName').setValue(this.userData.company[0].name);
						this.profileForm.get('firstName').setValue(this.userData.personal[0].firstname);
						this.profileForm.get('lastName').setValue(this.userData.personal[0].lastname);
						this.profileForm.get('email').setValue(this.userData.email);
					}
				}
			);
	}
}