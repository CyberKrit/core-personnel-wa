(function($){
	$(function() {

		var emailRegx = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/;

		var signup = {

			config: {
				preparedToSendData: false,
				_id: null,
				company: null,
				email: null,
				pwd: null,
				emailRegx: null,
				// subscription
				selectedSubId: null,
				subsList: null,
				subPopup: null,
				selectedSubscriptionIndex: null,
				defaultPrice: null,
				defaultLimit: null,
				defaultDuration: null,
				defaultCurrency: null,
				defaultName: null,
				// stripe
				stripeApiKey: null
			},

			init: function(option) {
				// extend input
				$.extend(signup.config,option);

				this.validation();
				this.stepOne(this.config.emailRegx);
				this.goBack();
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
									// fetch subscription plans
									$.ajax({
										method: 'GET',
										dataType: 'json',
										url: '/api/subscription',
										success: function(data, sattus, xhr) {
											if( data.status === true ) {
												// saving data to set subscription input
												var buildSubObj = [];
												$.each(data.resData, function(index, val) {
													buildSubObj.push({
														// first letter of name to uppercase
														_id: val._id,
														name: val.name.charAt(0).toUpperCase() + val.name.slice(1),
														price: val.price,
														currency: val.currency,
														duration: val.duration
													});
												});
												signup.config.subsList = buildSubObj;
												// calling relevant function
												signup.paymentForm(data.resData);											
											}
										},
										error: function(jqXhr, textStatus, errorMessage) {
												console.log(jqXhr);
										}
									}); // end of ajax call
								}
							},
							error: function(jqXhr, textStatus, errorMessage) {
								console.log(jqXhr);
							}
						}); // end of ajax call
					}

				}); // end of click event

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

			paymentForm: function(resData) {

				// initiate stripe
				this.stripeconfig(this.config.stripeApiKey);

				var $subParent = $('.select-subs-plan-list');
				
				if( !$subParent.find('li').length ) {
					// populate subscription tariff
					var $subParent = $('.select-subs-plan-list');
					$.each(resData, function(index, item) {
						var name = item.name || signup.config.defaultName,
								limit = parseInt(item.limit),
								price = parseInt(item.price) || signup.config.defaultPrice,
								duration = parseInt(item.duration),
								currency = '';

						// currency symbol
						currency = signup.currencyConversion(item.currency);

						// limit
						if( limit === 0 ) {
							limit = 'unlimited';
						} else if( !limit ) {
							limit = signup.config.defaultLimit;
						}

						// duration
						duration = signup.durationConversion(duration);

						$('<li><i class="pictorial"></i><div class="list-inner-content"><div class="name">' + name + '</div><div class="limit">' + limit + '</div><div class="plan">' + currency + price + '/<em>' + duration + '</em></div></div></li>').appendTo($subParent);

						// initiate popup
						signup.subscriptionPopup(signup.config.subPopup);
						signup.selectAnItem();

					});

				} // end of condition

				// set value for input field
				if( this.config.selectedSubscriptionIndex >= 0) {
					this.setSubInput(this.config.selectedSubscriptionIndex);
				}

				$('.select-subs-plan-list').find('li').removeClass('active');

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
						// highlight earlier selected plan
						$trgtItem.find('li').eq(signup.config.selectedSubscriptionIndex).addClass('active'); 
					}

				});

				// save and close popup
				$(target).find('.btn-save').on('click', function(e) {
					e.preventDefault();
					$(target).fadeOut(300);

					// set value for input field
					var getIndex = $('.select-subs-plan-list').find('li.active').index();
					if( typeof getIndex === 'number' && getIndex >= 0 ) {
						signup.setSubInput(getIndex);
					}

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

			currencyConversion: function(value) {
				value = value.toLowerCase();
				var currency = '$';

				if( value === 'euro' ) {
					currency = '€';
				} else if( value === 'pound' ) {
					currency = '£';
				}

				return currency;
			}, // end::currencyConversion

			durationConversion: function(duration) {
				var getDuration;

				if( duration === 12 ) {
					getDuration = 'year';
				} else if( duration === 1 ) {
					getDuration = 'month';
				}  else if( typeof duration !== 'number' ) {
					getDuration = this.config.defaultDuration + ' months';;
				} else {
					getDuration = duration + ' months';
				}

				return getDuration;
			}, // end::durationConversion

			setSubInput: function(input) {

				if( typeof input !== 'number' ) return;

				if( input >= 0 ) {
					var getIndex = input || 0,
							getItem = this.config.subsList[getIndex];

					var getCurrencyMark = this.currencyConversion(getItem.currency);
					var getDuration = this.durationConversion(getItem.duration);
					$('#field_subscription').val(getItem.name + ' - ' + getCurrencyMark + getItem.price + '/' + getDuration);

					$('.payment-form-wrapper').find('.inline-price').addClass('active').html(getCurrencyMark + getItem.price);

					// hide validation failed message
					$('#field_subscription').closest('.input-sub-outer').next('.input-status').find('.required').slideUp(300);

					this.config.selectedSubId = getItem._id;
				}

			}, // end::setSubInput

			stripeconfig: function(stripeApiKey) {
				// Create a Stripe client.
				var stripe = Stripe(stripeApiKey);

				// Create an instance of Elements.
				var elements = stripe.elements();

				// Custom styling can be passed to options when creating an Element.
				// (Note that this demo uses a wider set of styles than the guide below.)
				var style = {
				  base: {
				    fontFamily: '"Lato", sans-serif',
				    fontSize: '16px',
				    lineHeight: '18px',
				    fontWeight: 400,
				    color: '#fff',
				    fontSmoothing: 'antialiased',
				    iconColor: '#a1a1a1',
				    '::placeholder': {
				      color: '#a1a1a1'
				    }
				  },
				  invalid: {
				    color: '#f00',
				    iconColor: '#f00'
				  }
				};

				// Create an instance of the card Element.
				var card = elements.create('card', {style: style});

				// Add an instance of the card Element into the `card-element` <div>.
				card.mount('#card-element');

				// Handle real-time validation errors from the card Element.
				card.addEventListener('change', function(event) {
				  var displayError = document.getElementById('card-errors');
				  if (event.error) {
				    displayError.textContent = event.error.message;
				  } else {
				    displayError.textContent = '';
				  }
				});

				// Handle form submission.
				var form = document.getElementById('payment-form');
				form.addEventListener('submit', function(event) {
				  event.preventDefault();

				  stripe.createToken(card).then(function(result) {
				    if (result.error) {
				      // Inform the user if there was an error.
				      var errorElement = document.getElementById('card-errors');
				      errorElement.textContent = result.error.message;
				    } else {
				      // Send the token to your server.
				      signup.stripeTokenHandler(result.token);
				    }
				  });
				});

			}, // end::stripeconfig

			stripeTokenHandler: function(data) {
				this.config.preparedToSendData = true;

				var $subInputField = $('#field_subscription');

				if( !$subInputField.val() ) {
					this.enablePaymentForm();
					// show error
					$subInputField.closest('.input-sub-outer').next('.input-status').find('.required').slideDown(300);
				} else {
					this.disablePaymentForm();
					// hide error
					$subInputField.closest('.input-sub-outer').next('.input-status').find('.required').slideUp(300);

					// save data
					var buildReq = {
						company: signup.config.company,
						email: signup.config.email,
						pwd: signup.config.pwd,
						stripeToken: data.id,
						subscriptionId: signup.config.selectedSubId
					};

				  $.ajax({
				    method: 'POST',
				    dataType: 'json',
				    url: '/api/user',
				    data: buildReq,
				    success: function(data, status, xhr) {
				      console.log(data);
				      console.log(xhr.getResponseHeader('x-auth'));
				    },
				    error: function(jqXhr, textStatus, errorMessage) {
				    	console.log(jqXhr);
				      signup.enablePaymentForm();
				    }
				  });

				} // end if

			}, // stripeTokenHandler

			disablePaymentForm: function() {

				// disable subscription list select box
				$('.input-sub-outer').off('click');
				// enable button
				$('#submit-signup-data').prop('disabled', true);
				// show go-back button
				$('a.btn-go-back').fadeOut(300);
				// disable card input
				$('#card-element').css({ 'pointer-events': 'none' });

			}, // disablePaymentForm

			enablePaymentForm: function() {

				// enable subscription list select box
				this.subscriptionPopup();
				// disable button
				$('#submit-signup-data').removeAttr('disabled');
				// hide go-back button
				$('a.btn-go-back').fadeIn(300);
				// enable card input
				$('#card-element').css({ 'pointer-events': 'auto' });

			} // enablePaymentForm

		};

		signup.init({
			emailRegx: emailRegx, // regex for email validation
			subPopup: '#popup-subscription-signup', // target popup #id
			//selectedSubscriptionIndex: 3, // select first subscription plan by default
			defaultPrice: 10,
			defaultLimit: 10,
			defaultDuration: 1,
			defaultCurrency: 'usd',
			defaultName: 'Unspecified',
			// stripe
			stripeApiKey: 'pk_test_Okgc1K7VMvnqESGK5uMdmMCf'
		});

		var login = {

			config: {
				emailRegx: emailRegx,
				emailTest: false,
				pwdTest: false,
				pwdMinLength: 8
			},

			init: function(config) {
				$.extend(this.config, config);

				// this.validation();
				this.testCtrl();
				this.submit();
			},

			testCtrl: function() {
				var self = this,
						$loginForm = $('#form-login');

				// email
				$('#login_field_email').on('focusout keyup', function(e) {
					self.HandleError({ value: e.target.value, event: e.type, type: 'email' });
				});

				// pwd
				$('#login_field_pwd').on('focusout keyup', function(e) {
					self.HandleError({ value: e.target.value, event: e.type, type: 'pwd' });
				});

			},

			HandleError: function(req) {
				var $emailTrgt = $('.login-email-input-status');
				var $pwdTrgt = $('.login-pwd-input-status');

				if( req.type === 'email' ) {
					this.emailHandleError(req.value, req.event, $emailTrgt);
				}
				if( req.type === 'pwd' ) {
					this.pwdHandleError(req.value, req.event, $pwdTrgt);
				}
			},

			emailHandleError: function(value, event, $trgt) {
				var patternTest, required;
				patternTest = required = false;

				// test email pattern
				patternTest = emailRegx ? emailRegx.test(value) : false;
				// test require
				required = value ? true : false;

				if( required ) {
					$trgt.find('.required').slideUp(300);

					// patter test
					if( patternTest ) {
						$trgt.find('.pattern').slideUp(300);
					} else {
						// do not show error in type mode
						if( event === 'focusout' ) {
							$trgt.find('.pattern').slideDown(300);
						}
					}
				} else {
						if( event === 'focusout' ) {
							// do not show error in type mode
							$trgt.find('.required').slideDown(300);
						}
				}

				this.config.emailTest = ( patternTest && required ) ? true : false;

			}, // emailHandleError

			pwdHandleError: function(value, event, $trgt) {
				var patternTest, required;
				minlength = required = false;

				// test minlength
				minlength = value.length >= this.config.pwdMinLength ? true : false;
				// test require
				required = value ? true : false;

				if( required ) {
					$trgt.find('.required').slideUp(300);

					// patter test
					if( minlength ) {
						$trgt.find('.minlength').slideUp(300);
					} else {
						// do not show error in type mode
						if( event === 'focusout' ) {
							$trgt.find('.minlength').slideDown(300);
						}
					}
				} else {
						if( event === 'focusout' ) {
							// do not show error in type mode
							$trgt.find('.required').slideDown(300);
						}
				}

				this.config.pwdTest = ( minlength && required ) ? true : false;

			}, // pwdHandleError

			submit: function() {
				var self = this;

				$('.btn-login').on('click', function(e) {
					e.preventDefault();
					$('#login_field_email, #login_field_pwd').trigger('focusout');

					if( self.config.emailTest && self.config.pwdTest ) {



					}

				});
			}

		};

		login.init({
			emailRegx: emailRegx,
			pwdMinLength: 8
		});

	});
}(jQuery));