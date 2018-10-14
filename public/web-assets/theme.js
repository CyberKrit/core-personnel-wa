(function($){
	$(function() {

		var emailRegx = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/;

		// field company :: required
		$('#form-signup').find('#field_company').bind('focusout', function(e) {
			if(!e.target.value) {
				$(e.target).next('.input-status').find('.required').slideDown(300);
			} else {
				$(e.target).next('.input-status').find('.required').slideUp(300);
			}
		});

		$('#form-signup').find('#field_company').bind('keyup', function(e) {
			if(e.target.value) {
				$(e.target).next('.input-status').find('.required').slideUp(300);
			}
		});

		// field input :: required
		$('#form-signup').find('#field_pwd').bind('focusout', function(e) {
			if(!e.target.value) {
				$(e.target).next('.input-status').find('.required').slideDown(300);
				$(e.target).next('.input-status').find('.minlength').slideUp(300);
			}
			if(e.target.value) {
				$(e.target).next('.input-status').find('.required').slideUp(300);
			}
			if(e.target.value.length > 0 && e.target.value.length < 8) {
				$(e.target).next('.input-status').find('.minlength').slideDown(300);
			}
			if(e.target.value.length >= 8) {
				$(e.target).next('.input-status').find('.required').slideUp(300);
				$(e.target).next('.input-status').find('.minlength').slideUp(300);
			}
		});

		$('#form-signup').find('#field_pwd').bind('keyup', function(e) {
			if(e.target.value) {
				$(e.target).next('.input-status').find('.required').slideUp(300);
			}
			if(e.target.value.length >= 8) {
				$(e.target).next('.input-status').find('.minlength').slideUp(300);
			}
			if(e.target.value && e.target.value.length >= 8) {
				$(e.target).next('.input-status').slideDown(300);
			}
		});

		// field email :: required
		$('#form-signup').find('#field_email').bind('focusout', function(e) {
			if(!e.target.value) {
				$(e.target).next('.input-status').find('.required').slideDown(300);
					$(e.target).next('.input-status').find('.validation').slideUp(300);
			}
			if(e.target.value) {
				if(!emailRegx.test(e.target.value)) {
					$(e.target).next('.input-status').find('.validation').slideDown(300);
				} else {
					$(e.target).next('.input-status').find('.validation').slideUp(300);
				}
			}
		});

		$('#form-signup').find('#field_email').bind('keyup', function(e) {
			if(e.target.value) {
				$(e.target).next('.input-status').find('.required').slideUp(300);
			}
			if(!e.target.value) {
				$(e.target).next('.input-status').find('.validation').slideUp(300);
			}
			if(emailRegx.test(e.target.value)) {
				$(e.target).next('.input-status').find('.validation').slideUp(300);
			}
			
		});

		var inputValidation = {
			company: false,
			email: false,
			pwd: false
		};

		// form-action-button
		$('.form-action-button').on('click', function(e) {
			// company
			var companyStatus = false;
			var companyVal = $('#form-signup').find('#field_company').val();
			if( companyVal ) {
				companyStatus = true;
			} else {
				$('#field_company').next('.input-status').find('.required').slideDown(300);
			}

			// email
			var emailStatus = false;
			var emailVal = $('#form-signup').find('#field_email').val();
			if( emailVal && emailRegx.test(emailVal) ) {
				emailStatus = true;
			} else if( emailVal ) {
				$('#field_email').next('.input-status').find('.validation').slideDown(300);
			} else {
				$('#field_email').next('.input-status').find('.required').slideDown(300);
			}

			// pwd
			var pwdStatus = false;
			var pwdVal = $('#form-signup').find('#field_pwd').val();
			if( pwdVal && pwdVal.length >= 8 ) {
				pwdStatus = true;
			} else if( pwdVal ) {
				$('#field_pwd').next('.input-status').find('.validation').slideDown(300);
			} else {
				$('#field_pwd').next('.input-status').find('.required').slideDown(300);
			}

			if(companyStatus && emailStatus && pwdStatus) {console.log('sdf');
				$('.form-action-button').addClass('status-processing');
				$('#form-signup').find('#field_company').prop('disabled', true);
				$('#form-signup').find('#field_email').prop('disabled', true);
				$('#form-signup').find('#field_pwd').prop('disabled', true);
			}

			e.preventDefault();
		});

	});
}(jQuery));