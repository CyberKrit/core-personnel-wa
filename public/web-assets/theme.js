(function($){
	$(function() {

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
				var pattern = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/;
				if(!pattern.test(e.target.value)) {
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
			var pattern = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/;
			if(pattern.test(e.target.value)) {
				$(e.target).next('.input-status').find('.validation').slideUp(300);
			}
			
		});

	});
}(jQuery));