
'use strict';

/* 
 * 
 * smartMetadata
 * 
 * Validates and generates discovery metadata
 * 
 * Public functions
 * 
 * - generateMetadata - generates the set of tags for the package document 
 * 
 */

var smartMetadata = (function() { 

	/* generates accessibility metadata tags */
	function generateAccessibilityMetadata(format, quiet) {
	
		if (!quiet) {
			smartError.clearAll();
			if (!smartValidation.validateAccessibilityMetadata() || !smartValidation.validateEvaluationMetadata()) {
				if (!confirm(smart_errors.validation.general.failure[smart_lang])) {
					return '';
				}
			}
		}
		
		var isEPUB = format == 'epub' ? true : false;
		
		if (!isEPUB) {
			smartFormat.resetONIXCodes();
		}
		
		var discovery_metadata = document.getElementById('meta-tags');
			discovery_metadata.value = '';
		
		var meta_tags = isEPUB ? '<?xml version="1.0"?>\n<package xmlns="http://www.idpf.org/2007/opf" version="3.0" xml:lang="en">\n\t<metadata>\n'
								: '<?xml version="1.0" encoding="UTF-8"?>\n<ONIXMessage xmlns="http://ns.editeur.org/onix/3.0/reference" release="3.0">\n\t<Header></Header>\n\t<Product>\n\t\t<DescriptiveDetail>\n';
		
		// add accessibility features
		meta_tags += addMetaTag('schema:accessibilityFeature', 'accessibilityFeature', isEPUB);
		
		// add the summary
		var a11y_summary = document.getElementById('accessibilitySummary').value;
		
		var onix_summary_code = (document.querySelector('select#epub-a11y').value) == '1.0' ? '00' : '92';
		
		meta_tags += isEPUB ? smartFormat.createMetaTag({type: 'meta', property: 'schema:accessibilitySummary', value: a11y_summary})
								: smartFormat.formatONIXEntry( {list: '196', code: onix_summary_code, description: a11y_summary } );
		
		// add hazards
		meta_tags += addMetaTag('schema:accessibilityHazard', 'accessibilityHazard', isEPUB);
		
		// add access modes
		meta_tags += addMetaTag('schema:accessMode', 'accessMode', isEPUB);
		
		// add sufficent access modes
		meta_tags += addSufficientSetTags(isEPUB);
		
		// conformance claims are significantly incompatible between the formats so are handled separately
		
		var epub_ver = document.getElementById('epub-a11y').value;
		var certifier = document.getElementById('certifiedBy').value.trim();
		var credential = document.getElementById('certifierCredential').value.trim();
		var report = document.getElementById('certifierReport').value;
		var cert_date = document.getElementById('certificationDate').value;
		var pub_contact = document.getElementById('publisherContact').value;
		var ti_contact = document.getElementById('trustedIntermediaryContact').value;
		
		if (!isEPUB) {
		
			if (epub_ver == '1.0') {
				var ver_code = (smartWCAG.WCAGLevel() == 'aa') ? '03' : '02';
				meta_tags += smartFormat.formatONIXEntry( {list: '196', code: ver_code} );
			}
			
			else {
				// code for EPUB Accessibility 1.1
				meta_tags += smartFormat.formatONIXEntry( {list: '196', code: '04'} );
				
				var wcag_code = (smartWCAG.WCAGVersion() == '2.2') ? '82' : (smartWCAG.WCAGVersion() == '2.1' ? '81' : '80');
				meta_tags += smartFormat.formatONIXEntry( {list: '196', code: wcag_code} );
				
				var ver_code = (smartWCAG.WCAGLevel() == 'aaa') ? '86' : (smartWCAG.WCAGLevel() == 'aa' ? '85' : '84');
				meta_tags += smartFormat.formatONIXEntry( {list: '196', code: ver_code} );
			}
			
			if (certifier) {
				meta_tags += smartFormat.formatONIXEntry( {list: '196', code: '90', description: certifier} );
			}
			
			if (cert_date) {
				meta_tags += smartFormat.formatONIXEntry( {list: '196', code: '91', description: cert_date} );
			}
			
			if (credential) {
				meta_tags += smartFormat.formatONIXEntry( {list: '196', code: '93', description: credential} );
			}
			
			if (report) {
				meta_tags += smartFormat.formatONIXEntry( {list: '196', code: '96', description: report} );
			}
			
			if (ti_contact) {
				meta_tags += smartFormat.formatONIXEntry( {list: '196', code: '98', description: ti_contact} );
			}
			
			if (pub_contact) {
				meta_tags += smartFormat.formatONIXEntry( {list: '196', code: '99', description: pub_contact} );
			}
		}
		
		else {
			var conformance_url = '';
			
			if (epub_ver == '1.0') {
				/* the 1.0 specification has an idpf-specific url for an identifier */
				conformance_url = 'http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-' + smartWCAG.WCAGLevel();
			}
			
			else {
				conformance_url = 'EPUB Accessibility ' + epub_ver + ' - WCAG ' + smartWCAG.WCAGVersion() + ' Level ' + smartWCAG.WCAGLevel().toUpperCase(); 
			}
			
			var conformance_result = document.getElementById('conformance-result');
			
			if (conformance_result && conformance_result.value != "fail" && conformance_result.value != "incomplete") {
				if (epub_ver == '1.0') {
					meta_tags += smartFormat.createMetaTag({type: 'link', property: 'dcterms:conformsTo', value: conformance_url, id: 'epub-conformance'});
				}
				else {
					meta_tags += smartFormat.createMetaTag({type: 'meta', property: 'dcterms:conformsTo', value: conformance_url, id: 'epub-conformance'});
				}
				
				// add the certifier and reference the conformance statement
				meta_tags += smartFormat.createMetaTag({type: 'meta', property: 'a11y:certifiedBy', value: certifier, id: 'certifier', refines: 'epub-conformance'});
			}
			
			else {
				// add the certifier without reference to the conformance statement
				meta_tags += smartFormat.createMetaTag({type: 'meta', property: 'a11y:certifiedBy', value: certifier, id: 'certifier'});
			}
			
			meta_tags += smartFormat.createMetaTag({type: 'meta', property: 'dcterms:date', value: cert_date, refines: 'certifier'});
			meta_tags += smartFormat.createMetaTag({type: 'meta', property: 'a11y:certifierCredential', value: credential, refines: 'certifier'});
			meta_tags += smartFormat.createMetaTag({type: 'link', property: 'a11y:certifierReport', value: report, refines: 'certifier'});
		}
		
		if (!meta_tags) {
			alert(smart_ui.validation.general.noMetadata[smart_lang]);
		}
		
		else {
			
			if (isEPUB) {
				meta_tags += '\t</metadata>\n\t<manifest></manifest>\n\t<spine></spine>\n</package>';
			}
			
			else {
				meta_tags += '\t\t</DescriptiveDetail>\n\t</Product>\n</ONIXMessage>';
			}
			
			if (quiet) {
				return meta_tags;
			}
			
			else {
				discovery_metadata.value = meta_tags;
				if (meta_dialog) {
					meta_dialog.dialog('open');
				}
			}
		}
	}
	
	
	/* generates a meta tag for the specified property */
	function addMetaTag(property, id, isEPUB) {
		
		var checked_values = document.getElementById(id).querySelectorAll('input:checked');
		
		var meta_tag = '';
		
		for (var i = 0; i < checked_values.length; i++) {
			
			if (!isEPUB && ('onixMap' in checked_values[i].dataset)) {
				var codes = checked_values[i].dataset.onixMap.split(/, */);
				codes.forEach(function(code) {
					var id = code.split(/-/);
					meta_tag += smartFormat.formatONIXEntry({list: id[0], code: id[1]});
				});
			}
			
			else if (isEPUB && !('onixOnly' in checked_values[i].dataset)) {
				meta_tag += smartFormat.createMetaTag({type: 'meta', property: property, value: checked_values[i].value});
			}
		}
		
		return meta_tag;
	}
	
	
	/* concatenates the sufficient modes into a comma-separate string and generates the meta tag */
	function addSufficientSetTags(isEPUB) {
	
		var meta_tags = '';
		var fieldsets = document.getElementById('accessModeSufficient').getElementsByTagName('fieldset');
		
		for (var i = 0; i < fieldsets.length; i++) {
		
			var checked_modes = fieldsets[i].querySelectorAll('input:checked');
			var sufficient_set = '';
			
			for (var j = 0; j < checked_modes.length; j++) {
				sufficient_set += sufficient_set ? ',' : '';
				sufficient_set += checked_modes[j].value;
			}
			
			if (sufficient_set) {
				if (isEPUB) {
					meta_tags += smartFormat.createMetaTag({type: 'meta', property: 'schema:accessModeSufficient', value: sufficient_set});
				}
				else {
					if (checked_modes.length == 1 && ('onixMap' in checked_modes[0].dataset)) {
						var codes = checked_modes[0].dataset.onixMap.split(/, */);
						codes.forEach(function(code) {
							var id = code.split(/-/);
							meta_tags += smartFormat.formatONIXEntry({list: id[0], code: id[1]});
						});
					}
				}
			}
		}
		
		return meta_tags;
	}
	
	
	return {
		generateAccessibilityMetadata: function(format, quiet) {
			return generateAccessibilityMetadata(format, quiet);
		}
	}

})();
