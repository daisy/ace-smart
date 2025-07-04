
'use strict';

/* 
 * 
 * smartFormat
 * 
 * Provides content formatting functions
 * 
 * Public variables:
 * 
 * - BG - Background css class names
 * 
 * Public functions:
 * 
 * - setEPUBVersion - called to set _epubVersion to the version of the publication being evaluated
 * 
 * - createMetaTag - creates a package document meta/link tag compliant with the specified version of EPUB
 * 
 * - elementValueEscape - basic escaping for package meta element content
 * 
 * - attributeValueEscape - basic escaping for package meta/link attribute content
 * 
 * - convertUTCDateToString - converts a datetime value (YYYY-MM-DDTHH:MM:SSZ) into a human-readable string
 * 
 * - formatIdentifier - formats as urn scheme to human-readable string
 * 
 * - toTitleCase - converts a string to title case - capitalizes each word
 * 
 * - setFieldToError - highlights warnings/errors and sets aria-invalid
 * 
 * - setFieldToPass - highlights passes and unsets aria-invalid
 * 
 */

var smartFormat = (function() {
	
	var _epubVersion = 3;
	
	var _BG = {
		"ERR": 'err',
		"FAIL": 'err',
		"NA": 'na',
		"OBSOLETE": 'obsolete',
		"PARTIAL": 'partial',
		"PASS": 'pass',
		"WARN": 'warn'
	};
	
	var _onix = {
		196: [],
		175: [],
		144: [],
		143: [],
		81: [],
		21: []
	};
	
	return {
		BG: _BG,
		
		/* stores the epub version for use by the other formatting functions */
		setEPUBVersion: function(newVersion) {
			_epubVersion = newVersion;
		},
		
		
		/* creates a meta/link link tag with the specified property */
		createMetaTag: function(options) {
			options = typeof(options) === 'object' ? options : {};
			options.type = options.type ? options.type : 'meta';
			options.property = options.property ? options.property : '';
			options.value = options.value ? options.value : '';
			options.id = options.id ? options.id : '';
			options.refines = options.refines ? options.refines : '';
			
			if (options.value.trim() != '') {
				if (_epubVersion == 3) {
					if (options.type == 'meta') {
						return '\t\t<meta property="' + options.property + '"' + (options.id ? ' id="' + options.id + '"' : '') + (options.refines ? ' refines="#' + options.refines + '"' : '') + '>' + this.elementValueEscape(options.value) + '</meta>\n';
					}
					else {
						return '\t\t<link rel="' + options.property + '" href="' + this.attributeValueEscape(options.value) + '"' + (options.id ? ' id="' + options.id + '"' : '') + (options.refines ? ' refines="#' + options.refines + '"' : '') + '/>\n';
					}
				}
				else {
					return '\t\t<meta name="' + options.property + '" content="' + this.attributeValueEscape(options.value) + '"/>\n';
				}
			}
			return '';
		},
		
		
		/* resets the onix field tracker that prevents duplicate tagging */
		resetONIXCodes: function() {
			_onix = {
				196: [],
				175: [],
				144: [],
				143: [],
				81: [],
				21: []
			};
		},
		
		/* adds the general tagging wrapper for the accessibility metadata fields */
		formatONIXEntry: function(options) {
			
			if (_onix[options.list].includes(options.code)) {
				return '';
			}
			
			var feature = '';
			
			if (options.list == 196 || options.list == 143) {
				var type_num = options.list == 196 ? '09' : '12';
				feature = '\t\t\t<ProductFormFeature>\n'
							+ '\t\t\t\t<ProductFormFeatureType>' + type_num + '</ProductFormFeatureType>\n'
							+ '\t\t\t\t<ProductFormFeatureValue>' + options.code + '</ProductFormFeatureValue>\n';
				
				if (options.hasOwnProperty('description') && options.description !== '') {
					feature += '\t\t\t\t<ProductFormFeatureDescription>' + options.description + '</ProductFormFeatureDescription>\n';
				}
				
				feature += '\t\t\t</ProductFormFeature>\n';
			}
			
			else if (options.list == 175) {
				feature += '\t\t\t<ProductFormDetail>' + options.code + '</ProductFormDetail>\n';
				_onix['175'].push(options.code);
			}
			
			else if (options.list == 144) {
				feature += '\t\t\t<EpubTechnicalProtection>' + options.code + '</EpubTechnicalProtection>\n';
				_onix['144'].push(options.code);
			}
			
			else if (options.list == 81) {
				feature += '\t\t\t<PrimaryContentType>' + options.code + '</PrimaryContentType>\n';
				_onix['81'].push(options.code);
			}
			
			else if (options.list == 21) {
				feature += '\t\t\t<EditionType>' + options.code + '</EditionType>\n';
				_onix['21'].push(options.code);
			}
			
			else {
				console.log('Unable to format onix code ' + options.code + ' from list ' + options.list);
			}
			
			_onix[options.list].push(options.code);
			
			return feature;
		},
		
		
		/* escapes a value so it can be safely used in an xml element */
		elementValueEscape: function(value) {
			return value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
		},
		
		
		/* escapes a value so it can be safely used in an xml attribute */
		attributeValueEscape: function(value) {
			return value.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\r?\n/g, ' ');
		},
		
		
		/* convers a utc date to a string */
		convertUTCDateToString: function (utcDate, form) {
		
			if (form == 'yyyy-mm-dd') {
				return new Date(utcDate).toISOString().split('T')[0];
			}
			
			else if (form == 'notime') {
				var date_options = { year: "numeric", month: "short", day: "numeric" };  
				return (utcDate == '') ? '' : new Date(utcDate).toLocaleDateString("en",date_options);
			}
			
			else {
				// return a human readable string
				var date_options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };  
				return (utcDate == '') ? '' : new Date(utcDate).toLocaleDateString("en",date_options);
			}
		},
		
		
		/* reformts URNs - adds ISBN in front for urn:isbn, otherwise strips urn:xxx: leaving just the identifier */
		formatIdentifier: function (identifier) {
			if (identifier.match(/urn:isbn:/i)) {
				identifier = 'ISBN ' + identifier.replace('urn:isbn:','');
			}
			else {
				identifier = identifier.replace(/urn:[a-z0-9]+:/i, '');
			}
			return identifier;
		},
		
		
		/* converts the provided string to title case */
		toTitleCase: function(str) {
			return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		},
		
		
		/* formats the background color and aria-invalid status for errors */
		setFieldToError: function(options) {
			options = typeof(options) === 'object' ? options : {};
			if (!options.hasOwnProperty('id') || !options.id) {
				return;
			}
			options.is_warning = options.hasOwnProperty('is_warning') ? options.is_warning : false;
			options.highlight_parent = options.hasOwnProperty('highlight_parent') ? options.highlight_parent : false;
			
			var field = document.getElementById(options.id);
				field.setAttribute('aria-invalid', (options.is_warning ? false : true));
			
			if (options.highlight_parent) {
				field.parentNode.classList.remove(_BG.PASS,_BG.WARN,_BG.ERR);
				field.parentNode.classList.add(options.is_warning ? _BG.WARN : _BG.ERR);
			}
			
			else {
				field.classList.remove(_BG.PASS,_BG.WARN,_BG.ERR);
				field.classList.add(options.is_warning ? _BG.WARN : _BG.ERR);
			}
		},
		
		
		/* sets the background color and aria-invalid status for passes */
		setFieldToPass: function(options) {
			options = typeof(options) === 'object' ? options : {};
			if (!options.hasOwnProperty('id') || !options.id) {
				return;
			}
			options.highlight_parent = options.hasOwnProperty('highlight_parent') ? options.highlight_parent : false;
			
			var field = document.getElementById(options.id);
				field.setAttribute('aria-invalid', false);
			
			if (options.highlight_parent) {
				field.parentNode.classList.remove(_BG.PASS,_BG.WARN,_BG.ERR);
			}
			
			else {
				field.classList.remove(_BG.PASS,_BG.WARN,_BG.ERR);
			}
		},
		
		copyToClipboard: function(elemid) {
		
			var meta = document.getElementById(elemid);
			
			if (window.clipboardData && window.clipboardData.setData) {
				return window.clipboardData.setData("Text", meta.value);
			}
			
			else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
			
				meta.select();
				
				try {
					return document.execCommand("copy");
				}
				
				catch (ex) {
					return false;
				}
			}
		}
	}

})();
