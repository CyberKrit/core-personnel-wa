(function($){
	$(function() {

		var emailRegx = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/;

		var signup = {

			config: {
				_id: null,
				company: null,
				email: null,
				pwd: null,
				emailRegx: null,
				subPopup: null,
				selectedSubscriptionIndex: null
			},

			init: function(option) {
				// extend input
				$.extend(signup.config,option);

				this.validation();
				this.stepOne(this.config.emailRegx);
				this.goBack();
				this.subscriptionPopup(this.config.subPopup);
				this.selectAnItem();
			},

			validation: function() {
				this.companyValidation();
				this.emailValidation(this.config.emailRegx);
				this.pwdValidation();
			},

			companyValidation: function() {

				var $this = $('#form-signup').find('#field_company');

				// reflect focusout logic
				$this.bind('focusout', function(e) {
					var $target = $(e.target),
							targetVal = e.target.value,
							$required = $target.next('.input-status').find('.required');

					if(!targetVal) {
						$required.slideDown(300);
					} else {
						$required.slideUp(300);
					}
				});

				// hide required message if field is valid
				$this.bind('keyup', function(e) {
					if(e.target.value) {
						$(e.target).next('.input-status').find('.required').slideUp(300);
					}
				});

			}, // end::companyValidation

			emailValidation: function(emailRegx) {

				var $this = $('#form-signup').find('#field_email');

				// reflect focusout logic
				$this.bind('focusout', function(e) {
					var $target = $(e.target),
							targetVal = e.target.value,
							$required = $target.next('.input-status').find('.required'),
							$validation = $target.next('.input-status').find('.validation');

					if(!targetVal) {
						$required.slideDown(300);
						$validation.slideUp(300);
					}
					if(targetVal) {
						if(!emailRegx.test(targetVal)) {
							$validation.slideDown(300);
						} else {
							$validation.slideUp(300);
						}
					}
				});

				// reflect keyup logic
				$this.bind('keyup', function(e) {
					var $target = $(e.target),
							targetVal = e.target.value,
							$required = $target.next('.input-status').find('.required'),
							$validation = $target.next('.input-status').find('.validation');

					if(targetVal) {
						$required.slideUp(300);
					}
					if(!targetVal) {
						$validation.slideUp(300);
					}
					if(emailRegx.test(targetVal)) {
						$validation.slideUp(300);
					}
				});

			}, // end::emailValidation

			pwdValidation: function() {

				var $this = $('#form-signup').find('#field_pwd');

				$this.bind('focusout', function(e) {
					var $target = $(e.target),
							targetVal = e.target.value,
							$required = $target.next('.input-status').find('.required'),
							$minLength = $target.next('.input-status').find('.minlength');

					if(!targetVal) {
						$required.slideDown(300);
						$minLength.slideUp(300);
					}
					if(targetVal) {
						$required.slideUp(300);
					}
					if(targetVal.length > 0 && e.target.value.length < 8) {
						$minLength.slideDown(300);
					}
					if(targetVal.length >= 8) {
						$required.slideUp(300);
						$minLength.slideUp(300);
					}
				});

				$this.bind('keyup', function(e) {
					var $target = $(e.target),
							targetVal = e.target.value,
							$required = $target.next('.input-status').find('.required'),
							$minLength = $target.next('.input-status').find('.minlength');

					if(targetVal) {
						$required.slideUp(300);
					}
					if(targetVal.length >= 8) {
						$minLength.slideUp(300);
					}
				});

			}, // end::pwdValidation

			stepOne: function(emailRegx) {

				$('.form-action-button').on('click', function(e) {
					e.preventDefault();

					var company = signup.stepOneCompany();
					var email = signup.stepOneEmail(emailRegx);
					var pwd = signup.stepOnePwd();

					if(company.status && email.status && pwd.status) {
						// disable action button
						$('.form-action-button').prop('disabled', true);
						// start loading animation for action button
						$('.form-action-button').addClass('status-processing');

						// save data
						signup.config.company = company.value;
						signup.config.email = email.value;
						signup.config.pwd = pwd.value;

						// disable input field
						$formSignup = $('#form-signup');
						$formSignup.find('#field_company').prop('disabled', true);
						$formSignup.find('#field_email').prop('disabled', true);
						$formSignup.find('#field_pwd').prop('disabled', true);

						// create user for abandoned subscription listing
						$.ajax({
							method: 'POST',
							dataType: 'json',
							url: '/api/abandoned-subs',
							data: { company: company.value, email: email.value },
							success: function(data, status, xhr) {
								if( data.status === true ) {
									signup.config._id = data.clientId;
									signup.paymentForm();
								}
							},
							error: function(jqXhr, textStatus, errorMessage) {
								console.log(jqXhr);
							}
						});
					}

				});

			}, // end::stepOne

			stepOneCompany: function() {

				// company
				var companyStatus = false,
						$company = $('#form-signup').find('#field_company'),
						companyVal = $company.val();

				if( companyVal ) {
					companyStatus = true;
				} else {
					$company.next('.input-status').find('.required').slideDown(300);
				}

				return { value: companyVal, status: companyStatus };

			}, // end::stepOneCompany

			stepOneEmail: function(emailRegx) {

				// email
				var emailStatus = false,
						$email = $('#form-signup').find('#field_email'),
						$inputStatus = $email.next('.input-status'),
						emailVal = $email.val();

				if( emailVal && emailRegx.test(emailVal) ) {
					emailStatus = true;
				} else if( emailVal ) {
					$inputStatus.find('.validation').slideDown(300);
				} else {
					$inputStatus.find('.required').slideDown(300);
				}

				return { value: emailVal, status: emailStatus };

			}, // end::septOneEmail

			stepOnePwd: function() {

				var pwdStatus = false,
						$pwd = $('#form-signup').find('#field_pwd'),
						$pwdIStatus = $('#form-signup').find('#field_pwd').next('.input-status'),
						pwdVal = $('#form-signup').find('#field_pwd').val();

				if( pwdVal && pwdVal.length >= 8 ) {
					pwdStatus = true;
				} else if( pwdVal ) {
					$pwdIStatus.find('.validation').slideDown(300);
				} else {
					$pwdIStatus.find('.required').slideDown(300);
				}

				return { value: pwdVal, status: pwdStatus };

			}, // end::stepOnePwd

			paymentForm: function() {

				// reset primary form
				// because primary form is no longer visible
				$('.form-action-button').removeAttr('disabled');
				$('.form-action-button').removeClass('status-processing');
				// disable input field
				$formSignup = $('#form-signup');
				$formSignup.find('#field_company').removeAttr('disabled');
				$formSignup.find('#field_email').removeAttr('disabled');
				$formSignup.find('#field_pwd').removeAttr('disabled');

				// hide primary form
				$('.module-form').css({ display: 'none' });

				// show payment form
				$('.payment-form-wrapper').css({ display: 'block' });

				// reflect changes to bread-crumb
				$('.form-bread-crumb').find('li').removeClass('active').siblings('li').eq(1).addClass('active');

			}, // end::paymentForm

			goBack: function() {

				$('.payment-form-wrapper').find('.btn-go-back').on('click', function(e) {
					e.preventDefault();

					// hide payment form
					$('.payment-form-wrapper').css({ display: 'none' });

					// show primary form
					$('.module-form').css({ display: 'block' });

					// reflect changes to bread-crumb
					$('.form-bread-crumb').find('li').removeClass('active').siblings('li').eq(0).addClass('active');
				});

			}, // end::goBack

			subscriptionPopup: function(target) {

				$('.input-sub-outer').on('click', function(e) {
					e.preventDefault();

					// display popup
					$(target).fadeIn(300);

					// highlight previous selected item
					var $trgtItem = $('.select-subs-plan-list');

					if( typeof signup.config.selectedSubscriptionIndex === 'number') {
						$trgtItem.find('li').eq(signup.config.selectedSubscriptionIndex).addClass('active'); // highlight earlier selected plan
					}

				});

				// save and close popup
				$(target).find('.btn-save').on('click', function(e) {
					e.preventDefault();
					$(target).fadeOut(300);
					$('.select-subs-plan-list').find('li').removeClass('active');
				});

			}, // end::subscriptionPopup

			selectAnItem: function() {

				$('.select-subs-plan-list').on('click', 'li', function(e) {
					var $getPlan = $(e.target).closest('li');
					signup.config.selectedSubscriptionIndex = $getPlan.index();

					// store data
					$('.select-subs-plan-list').attr('data-selected', signup.config.selectedSubscriptionIndex);
					// highlight
					$getPlan.addClass('active').siblings('li').removeClass('active');
				});

			}, // end::selectAnItem

		};

		signup.init({
			emailRegx: emailRegx, // regex for email validation
			subPopup: '#popup-subscription-signup', // target popup #id
			selectedSubscriptionIndex: 0 // select first subscription plan by default
		});

	});
}(jQuery));