/*!
 * jQuery Pretty Dropdowns Plugin v4.13.0 by T. H. Doan (https://thdoan.github.io/pretty-dropdowns/)
 *
 * jQuery Pretty Dropdowns by T. H. Doan is licensed under the MIT License.
 * Read a copy of the license in the LICENSE file or at https://choosealicense.com/licenses/mit/
 */

(function($) {
  $.fn.prettyDropdown = function(oOptions) {

    // Default options
    oOptions = $.extend({
      classic: false,
      customClass: 'arrow',
      width: null,
      height: 50,
      hoverIntent: 200,
      multiDelimiter: '; ',
      multiVerbosity: 99,
      selectedMarker: '&#10003;',
      afterLoad: function(){}
    }, oOptions);

    oOptions.selectedMarker = '<span aria-hidden="true" class="checked"> ' + oOptions.selectedMarker + '</span>';
    // Validate options
    if (isNaN(oOptions.width) && !/^\d+%$/.test(oOptions.width)) oOptions.width = null;
    if (isNaN(oOptions.height)) oOptions.height = 50;
    else if (oOptions.height<8) oOptions.height = 8;
    if (isNaN(oOptions.hoverIntent) || oOptions.hoverIntent<0) oOptions.hoverIntent = 200;
    if (isNaN(oOptions.multiVerbosity)) oOptions.multiVerbosity = 99;

    // Translatable strings
    var MULTI_NONE = 'None selected',
      MULTI_PREFIX = 'Selected: ',
      MULTI_POSTFIX = ' selected';

    // Globals
    var $current,
      aKeys = [
        '0','1','2','3','4','5','6','7','8','9',,,,,,,,
        'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
      ],
      nCount,
      nHoverIndex,
      nLastIndex,
      nTimer,
      nTimestamp,

      // Initiate pretty drop-downs
      init = function(elSel) {
        var $select = $(elSel),
          nSize = elSel.size,
          sId = elSel.name || elSel.id || '',
          sLabelId;
        // Exit if widget has already been initiated
        if ($select.data('loaded')) return;
        // Remove 'size' attribute to it doesn't affect vertical alignment
        $select.data('size', nSize).removeAttr('size');
        // Set <select> height to reserve space for <div> container
        $select.css('visibility', 'hidden').outerHeight(oOptions.height);
        nTimestamp = +new Date();
        // Test whether to add 'aria-labelledby'
        if (elSel.id) {
          // Look for <label>
          var $label = $('label[for=' + elSel.id + ']');
          if ($label.length) {
            // Add 'id' to <label> if necessary
            if ($label.attr('id') && !/^menu\d{13,}$/.test($label.attr('id'))) sLabelId = $label.attr('id');
            else $label.attr('id', (sLabelId = 'menu' + nTimestamp));
          }
        }
        nCount = 0;
        var $items = $('optgroup, option', $select),
          $selected = $items.filter(':selected'),
          bMultiple = elSel.multiple,
          // Height - 2px for borders
          sHtml = '<ul' + (elSel.disabled ? '' : ' tabindex="0"') + ' role="listbox"'
            + (elSel.title ? ' title="' + elSel.title + '" aria-label="' + elSel.title + '"' : '')
            + (sLabelId ? ' aria-labelledby="' + sLabelId + '"' : '')
            + ' aria-activedescendant="item' + nTimestamp + '-1" aria-expanded="false"'
            + ' style="max-height:' + (oOptions.height-2) + 'px;margin:'
            // NOTE: $select.css('margin') returns an empty string in Firefox, so we have to get
            // each margin individually. See https://github.com/jquery/jquery/issues/3383
            + $select.css('margin-top') + ' '
            + $select.css('margin-right') + ' '
            + $select.css('margin-bottom') + ' '
            + $select.css('margin-left') + ';">';
        if (bMultiple) {
          sHtml += renderItem(null, 'selected');
          $items.each(function() {
            if (this.selected) {
              sHtml += renderItem(this, '', true)
            } else {
              sHtml += renderItem(this);
            }
          });
        } else {
          if (oOptions.classic) {
            $items.each(function() {
              sHtml += renderItem(this);
            });
          } else {
            sHtml += renderItem($selected[0], 'selected');
            $items.filter(':not(:selected)').each(function() {
              sHtml += renderItem(this);
            });
          }
        }
        sHtml += '</ul>';
        $select.wrap('<div ' + (sId ? 'id="prettydropdown-' + sId + '" ' : '')
          + 'class="prettydropdown '
          + (oOptions.classic ? 'classic ' : '')
          + (elSel.disabled ? 'disabled ' : '')
          + (bMultiple ? 'multiple ' : '')
          + oOptions.customClass + ' loading"'
          // NOTE: For some reason, the container height is larger by 1px if the <select> has the
          // 'multiple' attribute or 'size' attribute with a value larger than 1. To fix this, we
          // have to inline the height.
          + ((bMultiple || nSize>1) ? ' style="height:' + oOptions.height + 'px;"' : '')
          +'></div>').before(sHtml).data('loaded', true);
        var $dropdown = $select.parent().children('ul'),
          nWidth = $dropdown.outerWidth(true),
          nOuterWidth;
        $items = $dropdown.children();
        // Update default selected values for multi-select menu
        if (bMultiple) updateSelected($dropdown);
        else if (oOptions.classic) $('[data-value="' + $selected.val() + '"]', $dropdown).addClass('selected').append(oOptions.selectedMarker);
        // Calculate width if initially hidden
        if ($dropdown.width()<=0) {
          var $clone = $dropdown.parent().clone().css({
              position: 'absolute',
              top: '-100%'
            });
          $('body').append($clone);
          nWidth = $clone.children('ul').outerWidth(true);
          $('li', $clone).width(nWidth);
          nOuterWidth = $clone.children('ul').outerWidth(true);
          $clone.remove();
        }
        // Set dropdown width and event handler
        // NOTE: Setting width using width(), then css() because width() only can return a float,
        // which can result in a missing right border when there is a scrollbar.
        $items.width(nWidth).css('width', $items.css('width'));
        if (oOptions.width) {
          $dropdown.parent().css('min-width', $items.css('width'));
          $dropdown.css('width', '100%');
          $items.css('width', '100%');
        }
        $items.click(function() {
          var $li = $(this),
            $selected = $dropdown.children('.selected');
          // Ignore disabled menu
          if ($dropdown.parent().hasClass('disabled')) return;
          // Only update if not disabled, not a label, and a different value selected
          if ($dropdown.hasClass('active') && !$li.hasClass('disabled') && !$li.hasClass('label') && $li.data('value')!==$selected.data('value')) {
            // Select highlighted item
            if (bMultiple) {
              if ($li.children('span.checked').length) $li.children('span.checked').remove();
              else $li.append(oOptions.selectedMarker);
              // Sync <select> element
              $dropdown.children(':not(.selected)').each(function(nIndex) {
                $('optgroup, option', $select).eq(nIndex).prop('selected', $(this).children('span.checked').length>0);
              });
              // Update selected values for multi-select menu
              updateSelected($dropdown);
            } else {
              $selected.removeClass('selected').children('span.checked').remove();
              $li.addClass('selected').append(oOptions.selectedMarker);
              if (!oOptions.classic) $dropdown.prepend($li);
              $dropdown.removeClass('reverse').attr('aria-activedescendant', $li.attr('id'));
              if ($selected.data('group') && !oOptions.classic) $dropdown.children('.label').filter(function() {
                return $(this).text()===$selected.data('group');
              }).after($selected);
              // Sync <select> element
              $('optgroup, option', $select).filter(function() {
                // NOTE: .data('value') can return numeric, so using == comparison instead.
                return this.value==$li.data('value') || this.text===$li.contents().filter(function() {
                    // Filter out selected marker
                    return this.nodeType===3;
                  }).text();
              }).prop('selected', true);
            }
            $select.trigger('change');
          }
          if ($li.hasClass('selected') || !bMultiple) {
            $dropdown.toggleClass('active');
            $dropdown.attr('aria-expanded', $dropdown.hasClass('active'));
          }
          // Try to keep drop-down menu within viewport
          if ($dropdown.hasClass('active')) {
            // Close any other open menus
            if ($('.prettydropdown > ul.active').length>1) resetDropdown($('.prettydropdown > ul.active').not($dropdown)[0]);
            var nWinHeight = window.innerHeight,
              nMaxHeight,
              nOffsetTop = $dropdown.offset().top,
              nScrollTop = $(document).scrollTop(),
              nDropdownHeight = $dropdown.outerHeight();
            if (nSize) {
              nMaxHeight = nSize*(oOptions.height-2);
              if (nMaxHeight<nDropdownHeight-2) nDropdownHeight = nMaxHeight+2;
            }
            var nDropdownBottom = nOffsetTop-nScrollTop+nDropdownHeight;
            if (nDropdownBottom>nWinHeight) {
              // Expand to direction that has the most space
              if (nOffsetTop-nScrollTop>nWinHeight-(nOffsetTop-nScrollTop+oOptions.height)) {
                $dropdown.addClass('reverse');
                if (!oOptions.classic) $dropdown.append($selected);
                if (nOffsetTop-nScrollTop+oOptions.height<nDropdownHeight) {
                  $dropdown.outerHeight(nOffsetTop-nScrollTop+oOptions.height);
                  // Ensure the selected item is in view
                  $dropdown.scrollTop(nDropdownHeight);
                }
              } else {
                $dropdown.height($dropdown.height()-(nDropdownBottom-nWinHeight));
              }
            }
            if (nMaxHeight && nMaxHeight<$dropdown.height()) $dropdown.css('height', nMaxHeight + 'px');
            // Ensure the selected item is in view
            if (oOptions.classic) $dropdown.scrollTop($selected.index()*(oOptions.height-2));
          } else {
            $dropdown.data('clicked', true);
            resetDropdown($dropdown[0]);
          }
        });
        $dropdown.on({
          focusin: function() {
            // Unregister any existing handlers first to prevent duplicate firings
            $(window).off('keydown', handleKeypress).on('keydown', handleKeypress);
          },
          focusout: function() {
            $(window).off('keydown', handleKeypress);
          },
          mouseenter: function() {
            $dropdown.data('hover', true);
          },
          mouseleave: resetDropdown,
          mousemove:  hoverDropdownItem
        });
        // Put focus on menu when user clicks on label
        if (sLabelId) $('#' + sLabelId).off('click', handleFocus).click(handleFocus);
        // Done with everything!
        $dropdown.parent().width(oOptions.width||nOuterWidth||$dropdown.outerWidth(true)).removeClass('loading');
        oOptions.afterLoad();
      },

      // Manage widget focusing
      handleFocus = function(e) {
        $('ul[aria-labelledby=' + e.target.id + ']').focus();
      },

      // Manage keyboard navigation
      handleKeypress = function(e) {
        var $dropdown = $('.prettydropdown > ul.active, .prettydropdown > ul:focus');
        if (!$dropdown.length) return;
        if (e.which===9) { // Tab
          resetDropdown($dropdown[0]);
          return;
        } else {
          // Intercept non-Tab keys only
          e.preventDefault();
          e.stopPropagation();
        }
        var $items = $dropdown.children(),
          bOpen = $dropdown.hasClass('active'),
          nItemsHeight = $dropdown.height()/(oOptions.height-2),
          nItemsPerPage = nItemsHeight%1<0.5 ? Math.floor(nItemsHeight) : Math.ceil(nItemsHeight),
          sKey;
        nHoverIndex = Math.max(0, $dropdown.children('.hover').index());
        nLastIndex = $items.length-1;
        $current = $items.eq(nHoverIndex);
        $dropdown.data('lastKeypress', +new Date());
        switch (e.which) {
          case 13: // Enter
            if (!bOpen) {
              $current = $items.filter('.selected');
              toggleHover($current, 1);
            }
            $current.click();
            break;
          case 27: // Esc
            if (bOpen) resetDropdown($dropdown[0]);
            break;
          case 32: // Space
            if (bOpen) {
              sKey = ' ';
            } else {
              $current = $items.filter('.selected');
              toggleHover($current, 1);
              $current.click();
            }
            break;
          case 33: // Page Up
            if (bOpen) {
              toggleHover($current, 0);
              toggleHover($items.eq(Math.max(nHoverIndex-nItemsPerPage-1, 0)), 1);
            }
            break;
          case 34: // Page Down
            if (bOpen) {
              toggleHover($current, 0);
              toggleHover($items.eq(Math.min(nHoverIndex+nItemsPerPage-1, nLastIndex)), 1);
            }
            break;
          case 35: // End
            if (bOpen) {
              toggleHover($current, 0);
              toggleHover($items.eq(nLastIndex), 1);
            }
            break;
          case 36: // Home
            if (bOpen) {
              toggleHover($current, 0);
              toggleHover($items.eq(0), 1);
            }
            break;
          case 38: // Up
            if (bOpen) {
              toggleHover($current, 0);
              // If not already key-navigated or first item is selected, cycle to the last item; or
              // else select the previous item
              toggleHover(nHoverIndex ? $items.eq(nHoverIndex-1) : $items.eq(nLastIndex), 1);
            }
            break;
          case 40: // Down
            if (bOpen) {
              toggleHover($current, 0);
              // If last item is selected, cycle to the first item; or else select the next item
              toggleHover(nHoverIndex===nLastIndex ? $items.eq(0) : $items.eq(nHoverIndex+1), 1);
            }
            break;
          default:
            if (bOpen) sKey = aKeys[e.which-48];
        }
        if (sKey) { // Alphanumeric key pressed
          clearTimeout(nTimer);
          $dropdown.data('keysPressed', $dropdown.data('keysPressed')===undefined ? sKey : $dropdown.data('keysPressed') + sKey);
          nTimer = setTimeout(function() {
            $dropdown.removeData('keysPressed');
            // NOTE: Windows keyboard repeat delay is 250-1000 ms. See
            // https://technet.microsoft.com/en-us/library/cc978658.aspx
          }, 300);
          // Build index of matches
          var aMatches = [],
            nCurrentIndex = $current.index();
          $items.each(function(nIndex) {
            if ($(this).text().toLowerCase().indexOf($dropdown.data('keysPressed'))===0) aMatches.push(nIndex);
          });
          if (aMatches.length) {
            // Cycle through items matching key(s) pressed
            for (var i=0; i<aMatches.length; ++i) {
              if (aMatches[i]>nCurrentIndex) {
                toggleHover($items, 0);
                toggleHover($items.eq(aMatches[i]), 1);
                break;
              }
              if (i===aMatches.length-1) {
                toggleHover($items, 0);
                toggleHover($items.eq(aMatches[0]), 1);
              }
            }
          }
        }
      },

      // Highlight menu item
      hoverDropdownItem = function(e) {
        var $dropdown = $(e.currentTarget);
        if (e.target.nodeName!=='LI' || !$dropdown.hasClass('active') || new Date()-$dropdown.data('lastKeypress')<200) return;
        toggleHover($dropdown.children(), 0, 1);
        toggleHover($(e.target), 1, 1);
      },

      // Construct menu item
      // elOpt is null for first item in multi-select menus
      renderItem = function(elOpt, sClass, bSelected) {
        var sGroup = '',
          sText = '',
          sTitle;
        sClass = sClass || '';
        if (elOpt) {
          switch (elOpt.nodeName) {
            case 'OPTION':
              if (elOpt.parentNode.nodeName==='OPTGROUP') sGroup = elOpt.parentNode.getAttribute('label');
              sText = (elOpt.getAttribute('data-prefix') || '') + elOpt.text + (elOpt.getAttribute('data-suffix') || '');
              break;
            case 'OPTGROUP':
              sClass += ' label';
              sText = (elOpt.getAttribute('data-prefix') || '') + elOpt.getAttribute('label') + (elOpt.getAttribute('data-suffix') || '');
              break;
          }
          if (elOpt.disabled || (sGroup && elOpt.parentNode.disabled)) sClass += ' disabled';
          sTitle = elOpt.title;
          if (sGroup && !sTitle) sTitle = elOpt.parentNode.title;
        }
        ++nCount;
        return '<li id="item' + nTimestamp + '-' + nCount + '"'
          + (sGroup ? ' data-group="' + sGroup + '"' : '')
          + (elOpt && (elOpt.value||oOptions.classic) ? ' data-value="' + elOpt.value + '"' : '')
          + (elOpt && elOpt.nodeName==='OPTION' ? ' role="option"' : '')
          + (sTitle ? ' title="' + sTitle + '" aria-label="' + sTitle + '"' : '')
          + (sClass ? ' class="' + $.trim(sClass) + '"' : '')
          + ((oOptions.height!==50) ? ' style="height:' + (oOptions.height-2)
          + 'px;line-height:' + (oOptions.height-4) + 'px;"' : '') + '>' + sText
          + ((bSelected || sClass==='selected') ? oOptions.selectedMarker : '') + '</li>';
      },

      // Reset menu state
      // @param o Event or Element object
      resetDropdown = function(o) {
        var $dropdown = $(o.currentTarget||o);
        // NOTE: Sometimes it's possible for $dropdown to point to the wrong element when you
        // quickly hover over another menu. To prevent this, we need to check for .active as a
        // backup and manually reassign $dropdown. This also requires that it's not clicked on
        // because in rare cases the reassignment fails and the reverse menu will not get reset.
        if (o.type==='mouseleave' && !$dropdown.hasClass('active') && !$dropdown.data('clicked')) $dropdown = $('.prettydropdown > ul.active');
        $dropdown.data('hover', false);
        clearTimeout(nTimer);
        nTimer = setTimeout(function() {
          if ($dropdown.data('hover')) return;
          if ($dropdown.hasClass('reverse') && !oOptions.classic) $dropdown.prepend($dropdown.children(':last-child'));
          $dropdown.removeClass('active reverse').removeData('clicked').attr('aria-expanded', 'false').css('height', '');
          $dropdown.children().removeClass('hover nohover');
        }, (o.type==='mouseleave' && !$dropdown.data('clicked')) ? oOptions.hoverIntent : 0);
      },

      // Set menu item hover state
      // bNoScroll set on hoverDropdownItem()
      toggleHover = function($li, bOn, bNoScroll) {
        if (bOn) {
          $li.removeClass('nohover').addClass('hover');
          if ($li.length===1 && $current && !bNoScroll) {
            // Ensure items are always in view
            var $dropdown = $li.parent(),
              nDropdownHeight = $dropdown.outerHeight(),
              nItemOffset = $li.offset().top-$dropdown.offset().top-1; // -1px for top border
            if ($li.index()===0) {
              $dropdown.scrollTop(0);
            } else if ($li.index()===nLastIndex) {
              $dropdown.scrollTop($dropdown.children().length*oOptions.height);
            } else {
              if (nItemOffset+oOptions.height>nDropdownHeight) $dropdown.scrollTop($dropdown.scrollTop()+oOptions.height+nItemOffset-nDropdownHeight);
              else if (nItemOffset<0) $dropdown.scrollTop($dropdown.scrollTop()+nItemOffset);
            }
          }
        } else {
          $li.removeClass('hover').addClass('nohover');
        }
      },

      // Update selected values for multi-select menu
      updateSelected = function($dropdown) {
        var $select = $dropdown.parent().children('select'),
          aSelected = $('option', $select).map(function() {
            if (this.selected) return this.text;
          }).get(),
          sSelected;
        if (oOptions.multiVerbosity>=aSelected.length) sSelected = aSelected.join(oOptions.multiDelimiter) || MULTI_NONE;
        else sSelected = aSelected.length + '/' + $('option', $select).length + MULTI_POSTFIX;
        if (sSelected) {
          var sTitle = ($select.attr('title') ? $select.attr('title') : '') + (aSelected.length ? '\n' + MULTI_PREFIX + aSelected.join(oOptions.multiDelimiter) : '');
          $dropdown.children('.selected').text(sSelected);
          $dropdown.attr({
            'title': sTitle,
            'aria-label': sTitle
          });
        } else {
          $dropdown.children('.selected').empty();
          $dropdown.attr({
            'title': $select.attr('title'),
            'aria-label': $select.attr('title')
          });
        }
      };

    /**
     * Public Functions
     */

    // Resync the menu with <select> to reflect state changes
    this.refresh = function(oOptions) {
      return this.each(function() {
        var $select = $(this);
        $select.prevAll('ul').remove();
        $select.unwrap().data('loaded', false);
        this.size = $select.data('size');
        init(this);
      });
    };

    return this.each(function() {
      init(this);
    });

  };
}(jQuery));



(function($){
	$(function() {

		var emailRegx = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/;

    var pwdVisibility = {

      toggle: function() {

        $('[class*="__input-pwd-eye"]').on('click', function() {
          $(this).toggleClass('__open__');

          // toggle field type
          var inputType = $(this).hasClass('__open__') ? 'text' : 'password';
          $(this).closest('.__pwd-eye__').find('input').prop('type', inputType);
        });

      }

    };

    pwdVisibility.toggle();

    var serverErrDisplay = {

      init: function(err) {
        if( err ) {
          console.log(err);
          $('.error-strip__list-item.__' + err.status + '__').slideDown(240).siblings('.error-strip__list-item').slideUp(300);
        }
      },

      closeMsg: function() {

        $('.error-strip__hide').on('click', function() {
          $('.error-strip__list-item.__show__').slideUp(300);
        });

      }

    };

    serverErrDisplay.closeMsg();

		var signup = {

			config: {
				emailRegx: emailRegx,
        timeout: CLIENT_TIMEOUT,
				pwdMinLength: PWD_MIN_LENGTH,
				companyTest: false,
				emailTest: false,
				pwdTest: false,
				// subscription
				defaultDuration: 1,
				defaultCurrency: 'usd',
				defaultSymbol: '$',
				// strip
				stripeApiKey: STRIPE_API_KEY,
				// value
				value: {
					company: null,
					email: null,
					pwd: null,
					subscription: null,
          stripeToken: null,
          abandonedSub: null
				},
        // urlx
        populateSubscriptionURL: '/api/subscription',
        abandonedSubURL: '/api/abandoned-subs',
        createUserURL: '/api/user',
        emailAvaibilityURL: '/api/user/is-available/email/'
			},

			init: function(config) {
				$.extend(this.config, config);

				this.testCtrl();
				this.submit();
				this.populateData({ block: ['subscription'] });
				this.stripeconfig(this.config.stripeApiKey);
        this.goBack();

			}, // init

			testCtrl: function() {
				var self = this;

				// company
				$('#form--signup__input-company').on('focusout keyup', function(e) {
					self.HandleError({ value: e.target.value, event: e.type, type: 'company' });
				});

				// email
				$('#form--signup__input-email').on('focusout keyup', function(e) {
					self.HandleError({ value: e.target.value, event: e.type, type: 'email' });
				});

				// pwd
				$('#form--signup__input-pwd').on('focusout keyup', function(e) {
					self.HandleError({ value: e.target.value, event: e.type, type: 'pwd' });
				});

        // subscription
        $('#form--signup__input-subscription').on('change', function(e) {
          self.HandleError({ value: e.target.value, event: e.type, type: 'subscription' });
        });

			}, // testCtrl

			HandleError: function(req) {

				var $companyTrgt = $('.form--signup__input.-company').find('.err-list'),
						$emailTrgt = $('.form--signup__input.-email').find('.err-list'),
						$pwdTrgt = $('.form--signup__input.-pwd').find('.err-list'),
            $subscriptionTrgt = $('.form--signup__input.-subscription').find('.err-list');

				if( req.type === 'company' ) {
					this.companyHandleError(req.value, req.event, $companyTrgt);
				}
				if( req.type === 'email' ) {
					this.emailHandleError(req.value, req.event, $emailTrgt);
				}
				if( req.type === 'pwd' ) {
					this.pwdHandleError(req.value, req.event, $pwdTrgt);
				}
        if( req.type === 'subscription' ) {
          this.subscriptionHandleError(req.value, req.event, $subscriptionTrgt);
        }

			}, // HandleError

			companyHandleError: function(value, event, $trgt) {
				var required = false;
				// test require
				required = value ? true : false;

				if( required ) {
					$trgt.find('[class*="--required"]').slideUp(300);
				} else {
						if( event === 'focusout' ) {
							// do not show error in type mode
							$trgt.find('[class*="--required"]').slideDown(300);
						}
				}

				this.config.companyTest = required ? true : false;

			}, // companyHandleError

			emailHandleError: function(value, event, $trgt) {
				var patternTest, required;
				patternTest = required = false;

				// test email pattern
				patternTest = emailRegx ? emailRegx.test(value) : false;
				// test require
				required = value ? true : false;

        // hide email avaibility on keyup
        if( event === 'keyup' ) $trgt.find('[class*="--available"]').slideUp(300);

				if( required ) {
					$trgt.find('[class*="--required"]').slideUp(300);

					// patter test
					if( patternTest ) {
						$trgt.find('[class*="--pattern"]').slideUp(300);
					} else {
						// do not show error in type mode
						if( event === 'focusout' ) {
							$trgt.find('[class*="--pattern"]').slideDown(300);
						}
					}
				} else {
						if( event === 'focusout' ) {
							// do not show error in type mode
							$trgt.find('[class*="--required"]').slideDown(300);
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
					$trgt.find('[class*="--required"]').slideUp(300);

					// patter test
					if( minlength ) {
						$trgt.find('[class*="--minlength"]').slideUp(300);
					} else {
						// do not show error in type mode
						if( event === 'focusout' ) {
							$trgt.find('[class*="--minlength"]').slideDown(300);
						}
					}
				} else {
						if( event === 'focusout' ) {
							// do not show error in type mode
							$trgt.find('[class*="--required"]').slideDown(300);
						}
				}

				this.config.pwdTest = ( minlength && required ) ? true : false;

			}, // pwdHandleError

      subscriptionHandleError: function(value, event, $trgt) {
        var self = this;
        var required = false;
        // test require
        required = value ? true : false;

        if( required ) {
          $trgt.find('[class*="--required"]').slideUp(300);
        } else {
          $trgt.find('[class*="--required"]').slideDown(300);
        }

        // repopulate subscription options
        $refresh = $('.form--signup__input.-subscription').find('.__refresh__');
        $refresh.off('click');
        $refresh.on('click', function(e) {
          e.preventDefault();
          self.populateSubscription({ block: ['subscription'] });
        });

        this.config.companyTest = required ? true : false;

      }, // subscriptionHandleError

			submit: function() {
				var self = this;

				$('#form--signup__submit-step1-btn').on('click', function(e) {
          e.preventDefault();

          // err check
          $('#form--signup__input-company, #form--signup__input-email, #form--signup__input-pwd').trigger('focusout');

          self.submitFn();
				});

			}, // submit

      submitFn: function() {

        var self = this,
            $btnStep1 = $('#form--signup__submit-step1-btn'),
            $company = $('#form--signup__input-company'),
            $email = $('#form--signup__input-email'),
            $pwd = $('#form--signup__input-pwd');

        if( this.config.companyTest && this.config.emailTest && this.config.pwdTest) {
          $btnStep1.attr({ 'data-state': 'busy', disabled: true });

          // disable controls
          $company.prop('disabled', true);
          $email.prop('disabled', true);
          $pwd.prop('disabled', true);

          var $inputParent = $('.form--signup__input.-email').find('.__lazy-check__'),
              $errList = $('.form--signup__input.-email').find('.err-list');
          
          // show email check animation
          $inputParent.addClass('__lazy-check-active__');

          $.ajax({
            method: 'GET',
            dataType: 'json',
            url: self.config.emailAvaibilityURL + $email.val(),
            timeout: self.config.timeout,
            success: function(data, message, xhr) {
              $inputParent.removeClass('__lazy-check-active__');

              if( data.isAvailable === false ) {
                $errList.find('[class*="--available"]').slideDown(300);

                // disable controls
                $company.attr('disabled', false);
                $email.attr('disabled', false);
                $pwd.attr('disabled', false);

                $btnStep1.attr({ 'data-state': 'idle', disabled: false });
              } else {
                $errList.find('[class*="--available"]').slideUp(300);

                // add value
                self.config.value.company = $company.val();
                self.config.value.email = $email.val();
                self.config.value.pwd = $pwd.val();

                // saving data s abandoned subscription
                // will be removed after successful signup
                $.ajax({
                  method: 'POST',
                  dataType: 'json',
                  url: self.config.abandonedSubURL,
                  timeout: self.config.timeout,
                  data: { company: self.config.value.company, email: self.config.value.email },
                  success: function(data, status, xhr) {
                    if( xhr.status === 200 && data.clientId ) {
                      self.config.value.abandonedSub = data.clientId;

                      // open payment fieldset and hide current fieldset
                      $('.form--signup__step1').removeClass('__active__');
                      $('.form--signup__step2').addClass('__active__');
                    } else {
                      serverErrDisplay.init(xhr);
                    }
                  },
                  error: function(jqXhr, textStatus, errorMessage) {
                    serverErrDisplay.init(jqXhr);
                  }
                });

              }

            }, // success
            error: function(jqXhr) {
              $errList.find('[class*="--available"]').slideDown(300);
              serverErrDisplay.init(jqXhr);
            }
          }); // end ajax call

        } // endif

      }, // submitFn

      goBack: function() {

        $('#form--signup__submit-goback-btn').on('click', function(e) {
          e.preventDefault();

          $('#form--signup__submit-step1-btn').attr({ 'data-state': 'idle', disabled: false });

          // open primary fieldset and hide current fieldset
          $('.form--signup__step1').addClass('__active__');
          $('.form--signup__step2').removeClass('__active__');

          // enable controld
          $('#form--signup__input-company').attr('disabled', false);
          $('#form--signup__input-email').attr('disabled', false);
          $('#form--signup__input-pwd').attr('disabled', false);

        });

      }, // goBack

			populateData: function(req) {
				var getReq = req.block;

				// subscription
				var subscription = getReq.indexOf('subscription');
				if( subscription >= 0 ) {
					this.populateSubscription();
				}

			}, // populateData

			populateSubscription: function() {
				var self = this;

				$.ajax({
					method: 'GET',
					dataType: 'json',
					url: self.config.populateSubscriptionURL,
          timeout: self.config.timeout,
					success: function(data, status, xhr) {
						if( xhr.status === 200 && data.res.length ) {
							$.each( data.res, function( index, option ) {

								// currency
								var getcurrency = option.currency.toLowerCase() || self.config.defaultCurrency,
										currency = self.config.defaultSymbol;

								if(getcurrency === 'euro') currency = '€';
								if(getcurrency === 'pound') currency = '£';

								// duration
								var getDuration = option.duration || self.config.defaultDuration,
										duration = getDuration + ' months';

								if(getDuration === 12) duration = 'year';
								if(getDuration === 1) duration = 'month';

								// populate data
                
								$('<option value="' + option._id + '">' + option.name.charAt(0).toUpperCase() + option.name.slice(1) + ' - ' + currency + option.price + '/' + duration + '</option>').appendTo('#form--signup__input-subscription');

							});
		
							// trigger plugin
              if( data.res.length ) {
  							$('#form--signup__input-subscription').prettyDropdown({
  								classic: false,
  								width: '100%'
  							});
              }

						} else {

              serverErrDisplay.init(xhr);

            }// endif

					},
					error: function(jqXhr, textStatus, errorMessage) {console.log(errorMessage);
						serverErrDisplay.init(jqXhr);
					}
				});

			}, // populateSubscription

			stripeconfig: function(stripeApiKey) {
				var self = this;
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
				var form = document.getElementById('form--signup');
				form.addEventListener('submit', function(event) {
				  event.preventDefault();

				  stripe.createToken(card).then(function(result) {
				    if (result.error) {
				      // Inform the user if there was an error.
				      var errorElement = document.getElementById('card-errors');
				      errorElement.textContent = result.error.message;
				    } else {
				      // Send the token to your server.
				      self.stripeTokenHandler(result.token);
				    }
				  });
				});

			}, // end::stripeconfig

			stripeTokenHandler: function(data) {
				
				this.config.value.subscription = $('#form--signup__input-subscription').val();
        this.config.value.stripeToken = data.id;

        var $submit = $('#form--signup__submit-btn'),
            $goBack = $('#form--signup__submit-goback-btn');

        if( !this.config.value.subscription ) {
          $('#form--signup__input-subscription').trigger('change');
          this.enablePaymentSet();
        } else {
          this.disablePaymentSet();
          this.createUser();
        }

			}, // stripeTokenHandler

      enablePaymentSet: function() {
        $('#form--signup__submit-btn').attr({ 'data-state': 'idle', disabled: false });
        $('#form--signup__submit-goback-btn').fadeIn(240);
        $('#card-element').removeClass('__disabled__');
        $('.form--signup__input.-subscription').removeClass('__disabled__');
      }, // enablePaymentSet

      disablePaymentSet: function() {
        $('#form--signup__submit-btn').attr({ 'data-state': 'busy', disabled: true });
        $('#form--signup__submit-goback-btn').fadeOut(240);
        $('#card-element').addClass('__disabled__');
        $('.form--signup__input.-subscription').addClass('__disabled__');
      }, // enablePaymentSet

      createUser: function() {
        var self = this;

        $.ajax({
          method: 'POST',
          dataType: 'json',
          url: self.config.createUserURL,
          data: self.config.value,
          timeout: self.config.timeout,
          success: function(data, status, xhr) {
            if( xhr.status === 200 ) {
              window.location.replace('/email-confirmation');
            } else {
              self.enablePaymentSet();
              serverErrDisplay.init(xhr);
            }
          },
          error: function(jqXhr, textStatus, errorMessage) {
            self.enablePaymentSet();
            serverErrDisplay.init(jqXhr);
          }
        });

      }

		};

		signup.init();

		var login = {

			config: {
				emailRegx: emailRegx,
				emailTest: false,
				pwdTest: false,
				pwdMinLength: 8
			},

			init: function(config) {
				$.extend(this.config, config);

				this.testCtrl();
				this.submit();
			},

			testCtrl: function() {
				var self = this;

				// email
				$('#form--login__input-email').on('focusout keyup', function(e) {
					self.HandleError({ value: e.target.value, event: e.type, type: 'email' });
				});

				// pwd
				$('#form--login__input-pwd').on('focusout keyup', function(e) {
					self.HandleError({ value: e.target.value, event: e.type, type: 'pwd' });
				});

			},

			HandleError: function(req) {
				var $emailTrgt = $('.form--login__input.-email').find('.err-list');
				var $pwdTrgt = $('.form--login__input.-pwd').find('.err-list');

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
					$trgt.find('[class*="--required"]').slideUp(300);

					// patter test
					if( patternTest ) {
						$trgt.find('[class*="--pattern"]').slideUp(300);
					} else {
						// do not show error in type mode
						if( event === 'focusout' ) {
							$trgt.find('[class*="--pattern"]').slideDown(300);
						}
					}
				} else {
						if( event === 'focusout' ) {
							// do not show error in type mode
							$trgt.find('[class*="--required"]').slideDown(300);
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
					$trgt.find('[class*="--required"]').slideUp(300);

					// patter test
					if( minlength ) {
						$trgt.find('[class*="--minlength"]').slideUp(300);
					} else {
						// do not show error in type mode
						if( event === 'focusout' ) {
							$trgt.find('[class*="--minlength"]').slideDown(300);
						}
					}
				} else {
						if( event === 'focusout' ) {
							// do not show error in type mode
							$trgt.find('[class*="--required"]').slideDown(300);
						}
				}

				this.config.pwdTest = ( minlength && required ) ? true : false;

			}, // pwdHandleError

			submit: function() {
				var self = this;

				$('#form--login__submit-btn').on('click', function(e) {
					e.preventDefault();
					$('#form--login__input-email, #form--login__input-pwd').trigger('focusout');

					if( self.config.emailTest && self.config.pwdTest ) {console.log('sdsa');

						$('#form--login__submit-btn').attr({ 'data-state': 'busy', disabled: true });

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