
'use strict';

/* 
 * 
 * smartError
 * 
 * Error reporting functions
 * 
 * Public functions
 * 
 * - init - initializes the error pane and message list
 * 
 * - clearAll - calls the following three functions to reset error reporting - may be scoped to a specific tab
 *    - clearErrorPane - clears the error pane
 *    - clearARIAInvalid - resets aria-invalid attributes to false
 *    - clearErrorBGs - resets error and warning background shading to default colour
 * 
 * - logError - adds an error message to the error pane
 * 
 * - jumpToError - called whne a user clicks on an error message to jump them to the location
 * 
 * - showErrorPane - makes the error pane visible
 * 
 * - hideErrorPane - hides the error pane
 * 
 */

var smartError = (function() {

	var _errorPane = undefined;
	var _errorMessages = undefined;
	
	var _errorPaneVisible = false;
	
	var _SEVERITY = {'err': 'ERROR', 'warn': 'WARNING'};
	
	return {
		
		/* _errorPane and _errorMessages get initialized after the page has loaded and the elements are in the dom  */
		init: function() {
			_errorPane = document.getElementById('error-pane');
			_errorMessages = document.getElementById('error-msg');
		},
		
		
		/* calls all the clear functions to return the interface to a clear state */
		clearAll: function(scope) {
			this.clearErrorPane();
			this.clearAriaInvalid(scope);
			this.clearErrorBGs();
		},
		
		
		/* removes all the list items from the ordered list in the error pane */
		clearErrorPane: function() {
			if (_errorMessages) {
				while (_errorMessages.firstChild) {
					_errorMessages.removeChild(_errorMessages.firstChild);
				};
			}
		},
		
		
		/* finds any element with aria-invalid=true and resets them to aria-invalid=false */
		clearAriaInvalid: function(scope) {	
			scope = (scope != '') ? '#'+scope+' ' : ''; 
			var invalid = document.querySelectorAll(scope + '*[aria-invalid="true"]');
			for (var i = 0; i < invalid.length; i++) {
				invalid[i].setAttribute('aria-invalid',false);
			}
		},
		
		
		/* iterates over the elements whose background colors are changed based on their status and removes the classes */
		clearErrorBGs: function() {
			var errorFields = { "discovery": ['accessibilityFeature', 'accessibilitySummary-field', 'accessibilityHazard', 'accessMode', 'accessModeSufficient'],
						   "evaluation": ['certifiedBy']};
			
			for (var key in errorFields) {
				errorFields[key].forEach( function(id) {
					document.getElementById(id).classList.remove(smartFormat.BG.ERR, smartFormat.BG.WARN, smartFormat.BG.PASS, smartFormat.BG.NA);
				});
			}
		},
		
		
		/* adds an error entry to the list in the error pane */
		logError: function(options) {
			options = typeof(options) === 'object' ? options : {};
			options.tab_id = options.tab_id ? options.tab_id : '';
			options.element_id = options.element_id ? options.element_id : '';
			options.security_level = options.security_level ? options.security_level : '';
			
			if (!_errorMessages) {
				return;
			}
			
			if (!_errorPaneVisible) {
				this.showErrorPane();
			}
			
			/* adds an ID for the list item so that the link inside can refer to itself */
			var errorNumber = (_errorMessages.childElementCount + 1).pad(2);
			var error_li = document.createElement('li');
				error_li.setAttribute('id', 'err'+errorNumber);
		
			var error_link = document.createElement('a');
				error_link.setAttribute('href', '#err'+errorNumber);
				error_link.setAttribute('onclick', "smartError.jumpToError({tab: '"+options.tab_id+"', id: '"+options.element_id+"'}); return false;");
				error_link.appendChild(document.createTextNode('[' + _SEVERITY[options.severity] + '] ' + options.message));
			
			error_li.appendChild(error_link);
			_errorMessages.appendChild(error_li);
		},
		
		
		/* called to jump to a tab and item when a user clicks an error/warning in the error pane */
		jumpToError: function(options) {
			options = typeof(options) === 'object' ? options : {};
			if (!options.hasOwnProperty('tab') || !options.tab) {
				return;
			}
			if (!options.hasOwnProperty('id') || !options.id) {
				return;
			}
			
			document.getElementById('label_'+options.tab).click();
			
			var error_element = document.getElementById(options.id);
			var report_form = document.querySelector('form.report');
			
			var top = error_element.offsetTop - (options.tab == 'conformance' ? 160 : 140);
			
			report_form.scroll(0,top);
			
			error_element.focus();
		},
		
		
		/* make the error pane visible */
		showErrorPane: function() {
			_errorPane.classList.add('visible');
			document.body.classList.add('error-pane-padding');
			_errorPaneVisible = true;
		},
		
		
		/* hide the error pane */
		hideErrorPane: function() {
			_errorPane.classList.remove('visible');
			document.body.classList.remove('error-pane-padding');
			_errorPaneVisible = false;
		}
		
	}

})();
