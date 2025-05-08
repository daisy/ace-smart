
'use strict';

/* 
 * 
 * smartDiscovery
 * 
 * Validates and generates discovery metadata
 * 
 * Public functions
 * 
 * - validateDiscoveryMetadata - checks discovery metadata for errors and warnings
 * 
 * - generateDiscoveryMetadata - generates the set of tags for the package document 
 * 
 * - addCustomFeature - adds a custom accessibilityFeature to the form
 *  
 * - addNewSufficientSet - adds an additional blank set for accessModeSufficient
 * 
 */

var smartDiscovery = (function() { 

	var _PROP_ERROR = { accessibilityFeature: {}, accessibilityHazard: {}, accessMode: {}, accessibilitySummary: {}, accessModeSufficient: {} };
		
		_PROP_ERROR.accessibilityFeature.msg = smart_errors.validation.discovery.accessibilityFeature[smart_lang];
		_PROP_ERROR.accessibilityFeature.invalid = smart_errors.validation.discovery.accessibilityFeature_invalid[smart_lang];
		_PROP_ERROR.accessibilityFeature.none_unknown = smart_errors.validation.discovery.accessibilityFeature_none[smart_lang];
		_PROP_ERROR.accessibilityFeature.warn = false;
		
		_PROP_ERROR.accessibilityHazard.msg = smart_errors.validation.discovery.accessibilityHazard[smart_lang];
		_PROP_ERROR.accessibilityHazard.none_unknown = smart_errors.validation.discovery.accessibilityHazard_none[smart_lang];
		_PROP_ERROR.accessibilityHazard.flashing = smart_errors.validation.discovery.accessibilityHazard_flashing[smart_lang];
		_PROP_ERROR.accessibilityHazard.motion = smart_errors.validation.discovery.accessibilityHazard_motion[smart_lang];
		_PROP_ERROR.accessibilityHazard.sound = smart_errors.validation.discovery.accessibilityHazard_sound[smart_lang];
		_PROP_ERROR.accessibilityHazard.flashing_neg = smart_errors.validation.discovery.accessibilityHazard_flashingneg[smart_lang];
		_PROP_ERROR.accessibilityHazard.motion_neg = smart_errors.validation.discovery.accessibilityHazard_motionneg[smart_lang];
		_PROP_ERROR.accessibilityHazard.sound_neg = smart_errors.validation.discovery.accessibilityHazard_soundneg[smart_lang];
		_PROP_ERROR.accessibilityHazard.warn = false;
		
		_PROP_ERROR.accessMode.msg = smart_errors.validation.discovery.accessMode[smart_lang];
		_PROP_ERROR.accessMode.warn = false;
		
		_PROP_ERROR.accessibilitySummary.msg = smart_errors.validation.discovery.accessibilitySummary[smart_lang];
		_PROP_ERROR.accessibilitySummary.warn = true;
		
		_PROP_ERROR.accessModeSufficient = { missing: {}, none: {}, duplicate: {} };
		
		_PROP_ERROR.accessModeSufficient.missing.msg = smart_errors.validation.discovery.accessModeSufficient_missing[smart_lang];
		_PROP_ERROR.accessModeSufficient.missing.warn = true;
		 
		_PROP_ERROR.accessModeSufficient.none.msg = smart_errors.validation.discovery.accessModeSufficient_none[smart_lang];
		_PROP_ERROR.accessModeSufficient.none.warn = true;

		_PROP_ERROR.accessModeSufficient.duplicate.msg = smart_errors.validation.discovery.accessModeSufficient_duplicate[smart_lang];
		_PROP_ERROR.accessModeSufficient.duplicate.warn = false;
	
	
	/* checks that at least one item has been checked for required metadata */
	function validateDiscoveryMetadata(clear) {
	
		if (clear) {
			smartError.clearAll('discovery');
		}
		
		var is_valid = true;
		
		is_valid = verifyOneItemChecked('accessibilityFeature');
		
		if (document.getElementById('accessibilitySummary').value.replace(/\s/g,'') == '') {
			smartError.logError({tab_id: 'discovery', element_id: 'accessibilitySummary-field', severity: 'warn', message: _PROP_ERROR['accessibilitySummary'].msg});
			smartFormat.setFieldToError({id: 'accessibilitySummary-field', is_warning: _PROP_ERROR['accessibilitySummary'].warn, highlight_parent: false});
			is_valid = false;
		}
		
		else {
			smartFormat.setFieldToPass({id: 'accessibilitySummary-field', highlight_parent: false});
		}
		
		is_valid = verifyOneItemChecked('accessibilityHazard') ? is_valid : false;
		
		is_valid = verifyOneItemChecked('accessMode') ? is_valid : false;
		
		is_valid = verifySufficientModes() ? is_valid : false;
		
		return is_valid;
		
	}
	
	
	/* checks that at least one checkbox in the specified fieldset is checked */
	function verifyOneItemChecked(id, found) {
		var checked_items = document.querySelectorAll('fieldset#' + id + ' input:checked')
		
		if (checked_items.length > 0) {
			
			if (id === 'accessibilityFeature') {
				return checkFeatureConflicts(id, checked_items);
			}
			
			else if (id === 'accessibilityHazard') {
				return checkHazardConflicts(id, checked_items);
			}
			
			else {
				smartFormat.setFieldToPass({id: id, highlight_parent: false});
				return true;
			}
		}
		
		else {
			smartError.logError({tab_id: 'discovery', element_id: id, severity: 'err', message: _PROP_ERROR[id].msg});
			smartFormat.setFieldToError({id: id, is_warning: _PROP_ERROR[id].warn, highlight_parent: false});
			return false;
		}
	}
	
	
	
	// check that unknown and none feature values are only set for non-conforming publications
	function checkFeatureConflicts(id, checked_items) {
		
		var is_valid = true;
		var is_invalid = ['none','unknown']
		
		for (var i = 0; i < checked_items.length; i++) {
			if (is_invalid.includes(checked_items[i].value)) {
				is_valid = false;
				break;
			}
		}
		
		if (is_valid) {
			smartFormat.setFieldToPass({id: id, highlight_parent: false});
			return true;
		}
		
		else {
			if (document.getElementById('epub-discovery-pass').checked) {
				// none and unknown cannot be set when the discovery metadata criterion is passed
				smartError.logError({tab_id: 'discovery', element_id: id, severity: 'err', message: _PROP_ERROR[id].invalid});
				smartFormat.setFieldToError({id: id, is_warning: _PROP_ERROR[id], highlight_parent: false});
				return false;
			}
			
			else if (checked_items.length > 1) {
				// none and unknown cannot be set with other features
				smartError.logError({tab_id: 'discovery', element_id: id, severity: 'err', message: _PROP_ERROR[id].none_unknown});
				smartFormat.setFieldToError({id: id, is_warning: _PROP_ERROR[id], highlight_parent: false});
				return false;
			}
			
			else {
				// if no conformance claim then it's okay to specify these values
				smartFormat.setFieldToPass({id: id, highlight_parent: false});
				return true;
			}
		}
	}
	
	
	// check that positive and negative hazard values are not set together
	function checkHazardConflicts(id, checked_items) {
		
		if (checked_items.length < 2) {
			return true;
		}
		
		var hazards = [];
		
		for (var i = 0; i < checked_items.length; i++) {
			hazards.push(checked_items[i].value);
		}
		
		if (hazards.includes('none') || hazards.includes('unknown')) {
			smartError.logError({tab_id: 'discovery', element_id: id, severity: 'err', message: _PROP_ERROR[id].none_unknown});
			smartFormat.setFieldToError({id: id, is_warning: _PROP_ERROR[id], highlight_parent: false});
			return false;
		}
		
		else if (hazards.includes('flashing') && (hazards.includes('noFlashingHazard') || hazards.includes('unknownFlashingHazard'))) {
			smartError.logError({tab_id: 'discovery', element_id: id, severity: 'err', message: _PROP_ERROR[id].flashing});
			smartFormat.setFieldToError({id: id, is_warning: _PROP_ERROR[id], highlight_parent: false});
			return false;
		}
		
		else if (hazards.includes('motionSimulation') && (hazards.includes('noMotionSimulationHazard') || hazards.includes('unknownMotionSimulationHazard'))) {
			smartError.logError({tab_id: 'discovery', element_id: id, severity: 'err', message: _PROP_ERROR[id].motion});
			smartFormat.setFieldToError({id: id, is_warning: _PROP_ERROR[id], highlight_parent: false});
			return false;
		}
		
		else if (hazards.includes('sound') && (hazards.includes('noSoundHazard') || hazards.includes('unknownSoundHazard'))) {
			smartError.logError({tab_id: 'discovery', element_id: id, severity: 'err', message: _PROP_ERROR[id].sound});
			smartFormat.setFieldToError({id: id, is_warning: _PROP_ERROR[id], highlight_parent: false});
			return false;
		}
		
		else if (hazards.includes('noFlashingHazard') && hazards.includes('unknownFlashingHazard')) {
			smartError.logError({tab_id: 'discovery', element_id: id, severity: 'err', message: _PROP_ERROR[id].flashing_neg});
			smartFormat.setFieldToError({id: id, is_warning: _PROP_ERROR[id], highlight_parent: false});
			return false;
		}
		
		else if (hazards.includes('noMotionSimulationHazard') && hazards.includes('unknownMotionSimulationHazard')) {
			smartError.logError({tab_id: 'discovery', element_id: id, severity: 'err', message: _PROP_ERROR[id].motion_neg});
			smartFormat.setFieldToError({id: id, is_warning: _PROP_ERROR[id], highlight_parent: false});
			return false;
		}
		
		else if (hazards.includes('noSoundHazard') && hazards.includes('unknownSoundHazard')) {
			smartError.logError({tab_id: 'discovery', element_id: id, severity: 'err', message: _PROP_ERROR[id].sound_neg});
			smartFormat.setFieldToError({id: id, is_warning: _PROP_ERROR[id], highlight_parent: false});
			return false;
		}
		
		else {
			smartFormat.setFieldToPass({id: id, highlight_parent: false});
			return true;
		}
	}
	
	
	/* checks that sufficient modes are set and don't repeat themselves */
	function verifySufficientModes() {
		var fieldsets = document.getElementById('accessModeSufficient').getElementsByTagName('fieldset');
		var sufficient_mode_sets = [];
		
		// check sufficient modes have been checked
		for (var i = 0; i < fieldsets.length; i++) {
			var checked_modes = fieldsets[i].querySelectorAll('input:checked');
			var this_set = '';
			
			for (var j = 0; j < checked_modes.length; j++) {
				this_set += checked_modes[j].value;
				
				// issue a warning if not also selected as a primary access mode
				if (!document.querySelector('#accessMode input[type="checkbox"][value="'+checked_modes[j].value+'"]:checked')) {
					smartError.logError({tab_id: 'discovery', element_id: 'accessModeSufficient', severity: 'warn', message: _PROP_ERROR.accessModeSufficient.missing.msg.replace('%%val%%', checked_modes[j].value)});
					smartFormat.setFieldToError({id: 'accessModeSufficient', is_warning: _PROP_ERROR.accessModeSufficient.missing.warn, highlight_parent: false});
					return false;
				}
			}
			
			if (this_set != '') {
				sufficient_mode_sets.push(this_set);
			}
		}
	
		if (sufficient_mode_sets.length == 0) {
			smartError.logError({tab_id: 'discovery', element_id: 'accessModeSufficient', severity: 'warn', message: _PROP_ERROR.accessModeSufficient.none.msg});
			smartFormat.setFieldToError({id: 'accessModeSufficient', is_warning: _PROP_ERROR.accessModeSufficient.none.warn, highlight_parent: false});
			return false;
		}
		
		else if (sufficient_mode_sets.length > 1) {
			// check there are no duplicate sets
			sufficient_mode_sets.sort();
			for (var i = 1; i < sufficient_mode_sets.length; i++) {
				if (sufficient_mode_sets[i] == sufficient_mode_sets[i-1]) {
					smartError.logError({tab_id: 'discovery', element_id: 'accessModeSufficient', severity: 'err', message: _PROP_ERROR.accessModeSufficient.duplicate.msg});
					smartFormat.setFieldToError({id: 'accessModeSufficient', is_warning: _PROP_ERROR.accessModeSufficient.duplicate.warn, highlight_parent: false});
					return false;
				}
			}
		}
		
		smartFormat.setFieldToPass({id: 'accessModeSufficient', highlight_parent: false});
		
		return true;
	}
	
	
	
	/* adds the discovery metadata fields to the form */
	function addDiscoveryMetadata() {
		
		var meta_fields = document.getElementById('discovery-fields');
		
		for (var i = 0; i < a11y_meta.properties.length; i++) {
			
			var property = a11y_meta.properties[i];
			
			var fieldset = document.createElement('fieldset');
				fieldset.setAttribute('id', property.type == 'textarea' ? property.id+'-field' : property.id);
			
			var legend = document.createElement('legend');
			
			var property_name = property.name[smart_lang];
			
			var field_name = document.createTextNode(property_name);
			
			if (property.type == 'textarea') {
				// adds a label to tie the field name to the textarea
				var label = document.createElement('label');
					label.setAttribute('for', property.id);
				label.appendChild(field_name);
				legend.appendChild(label);
			}
			else {
				legend.appendChild(field_name);
			}
			
			if (property.required) {
				var asterisk = document.createElement('img');
					asterisk.setAttribute('src', '/images/asterisk.png');
					asterisk.setAttribute('alt', 'required');
				legend.appendChild(document.createTextNode(' '));
				legend.appendChild(asterisk);
			}
			
			// add link to techniques
			var help_link = document.createElement('a');
				help_link.setAttribute('href', property.documentation[smart_lang]);
				help_link.setAttribute('target', '_blank');
				help_link.setAttribute('class', 'usage');
			
			var help_img_alt = smart_ui.discovery.moreInfo[smart_lang] + property.name[smart_lang].toLowerCase();
			
			var help_img = document.createElement('img');
				help_img.setAttribute('src', '/images/info.png');
				help_img.setAttribute('height', '20px');
				help_img.setAttribute('alt', help_img_alt);
				help_img.setAttribute('title', help_img_alt);
				help_img.setAttribute('onmouseover', "this.src='/images/info_hover.png'");
				help_img.setAttribute('onmouseout', "this.src='/images/info.png'");
				
				help_link.appendChild(help_img);
			
			legend.appendChild(help_link);
			
			fieldset.appendChild(legend);
			
			if (property.hasOwnProperty('autoPopulate')) {
				var auto_div = document.createElement('div');
					auto_div.setAttribute('id', property.autoPopulate.id);
					auto_div.setAttribute('class', 'autogen');
				
				var auto_link = document.createElement('a');
					auto_link.setAttribute('href', '#'+property.autoPopulate.id);
					auto_link.appendChild(document.createTextNode(property.autoPopulate.label[smart_lang]));
				
				auto_div.appendChild(auto_link);
				fieldset.appendChild(auto_div);
			}
			
			if (property.type == 'textarea') {
				var textarea = document.createElement('textarea');
					textarea.setAttribute('id', property.id);
					textarea.setAttribute('rows', 5);
					if (property.required) {
						textarea.setAttribute('aria-required', true);
					}
				fieldset.appendChild(textarea);
			}
			
			else if (property.type == 'checkbox') {
				var cols = createCheckboxList(property.values);
					fieldset.appendChild(cols);
			}
			
			else if (property.type == 'fieldset') {
				var source = property.id == 'accessModeSufficient' ? a11y_meta.properties.find(item => item.id === 'accessMode') : null;
				var cols = createCheckboxList(source.values);
				for (var k = 1; k <= 2; k++) {
					var sub_fieldset = document.createElement('fieldset');
						sub_fieldset.setAttribute('id', 'set'+k);
					
					var sub_legend = document.createElement('legend');
						sub_legend.appendChild(document.createTextNode('Set ' + k));
					
					sub_fieldset.appendChild(sub_legend);
					sub_fieldset.appendChild(cols.cloneNode(true));
					fieldset.appendChild(sub_fieldset);
				}
			}
			
			else {
				console.log('Unknown property type ' + property.type);
			}
			
			if (property.hasOwnProperty('addMoreValues')) {
				fieldset.appendChild(createAddMoreValuesLink(property));
			}
			
			meta_fields.appendChild(fieldset);
		}
		
		/* watch for click to add custom accessibilityFeature */
		$('#add-a11y-feature').click( function(){
			smartDiscovery.addCustomFeature();
			return false;
		});
		
		/* watch for click to generate a summary */
		$('#add-summary').click( function(){
			if (document.getElementById('accessibilitySummary').value.trim() != '') {
				if (!confirm(smart_ui.discovery.replaceSummary[smart_lang])) {
					return false;
				}
			}
			smartDiscovery.generateAccessibilitySummary();
			return false;
		});
		
		/* watch for click to add additional accessModeSufficient sets */
		$('#add-sufficient').click( function(){
			smartDiscovery.addNewSufficientSet();
			return false;
		});
	}
	
	
	
	/* generates sets of checkboxes for the a11y properties */
	function createCheckboxList(values) {
		var cols = document.createElement('div');
			cols.setAttribute('class', 'cols');
		
		for (var j = 0; j < values.length; j++) {
			var label = document.createElement('label');
			var input = document.createElement('input');
				input.setAttribute('type', 'checkbox');
				input.setAttribute('value', values[j].id);
			label.appendChild(input);
			label.appendChild(document.createTextNode(' ' + values[j].label[smart_lang]));
			cols.appendChild(label);
		}
		return cols;		
	}
	
	
	
	/* creates a link to add more values for a property */
	function createAddMoreValuesLink(property) {
		var custom_div = document.createElement('div');
			custom_div.setAttribute('id', 'add-'+property.id);
			custom_div.setAttribute('class','link');
		
		var custom_a = document.createElement('a');
			custom_a.setAttribute('href','#add-'+property.id);
			custom_a.setAttribute('id',property.addMoreValues.id);
			custom_a.appendChild(document.createTextNode(property.addMoreValues.label[smart_lang]));
		
		custom_div.appendChild(custom_a);
		
		return custom_div
	}
	
	
	/* generates accessibility metadata tags */
	function generateAccessibilityMetadata(format) {
	
		if (!validateDiscoveryMetadata()) {
			if (!confirm(smart_errors.validation.general.failure[smart_lang])) {
				return;
			}
		}
		
		if (!smartEvaluation.validateEvaluationMetadata(false)) {
			if (!confirm(smart_errors.validation.evaluation.failed[smart_lang])) {
				return '';
			}
		}
		
		var isEPUB = format == 'epub' ? true : false;
		
		var discovery_metadata = document.getElementById('meta-tags');
			discovery_metadata.value = '';
		
		var meta_tags = isEPUB ? '<?xml version="1.0"?>\n<package xmlns="http://www.idpf.org/2007/opf" version="3.0">\n\t<metadata>\n'
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
			
			if (credential) {
				meta_tags += smartFormat.formatONIXEntry( {list: '196', code: '93', description: credential} );
			}
			
			if (report) {
				meta_tags += smartFormat.formatONIXEntry( {list: '196', code: '96', description: report} );
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
			
			meta_tags += smartFormat.createMetaTag({type: 'meta', property: 'a11y:certifiedCredential', value: credential, refines: 'certifier'});
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
			
			discovery_metadata.value = meta_tags;
			if (meta_dialog) {
				meta_dialog.dialog('open');
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
	
	
	/* adds a new user-defined accessibility feature to the form */
	function addCustomFeature(feature_name) {
		
		if (!feature_name) {
			feature_name = prompt(smart_ui.discovery.newFeatureName[smart_lang]);
		}
		
		if (feature_name) {
		
			feature_name = feature_name.trim();
			
			if (feature_name) {
				if (document.getElementById(feature_name)) {
					alert(smart_ui.discovery.featureExists[smart_lang]);
				}
				
				else {
					var new_feature_label = document.createElement('label');
						new_feature_label.setAttribute('class', 'custom');
					
					var new_feature_checkbox = document.createElement('input');
						new_feature_checkbox.setAttribute('type', 'checkbox');
						new_feature_checkbox.setAttribute('value', feature_name);
						new_feature_checkbox.setAttribute('checked', 'checked');
					
					new_feature_label.appendChild(new_feature_checkbox);
					
					new_feature_label.appendChild(document.createTextNode(' ' + feature_name));
					
					// get the link to add new features
					var add_feature_link = document.getElementById('add-accessibilityFeature');
					
					// append the new feature to the column-formatted div before the link
					add_feature_link.parentNode.getElementsByClassName('cols')[0].appendChild(new_feature_label, add_feature_link);
				}
			}
			else {
				alert(smart_ui.discovery.invalidFeature[smart_lang]);
			}
		}
	}
	
	
	/* adds an additional sufficient set to the form */
	function addNewSufficientSet() {
	
		var set_count = document.getElementById('accessModeSufficient').getElementsByTagName('fieldset').length + 1;
		
		var new_fieldset = document.createElement('fieldset');
			new_fieldset.setAttribute('id', 'set' + set_count);
			new_fieldset.setAttribute('class', 'custom');
		
		var legend = document.createElement('legend');
			legend.appendChild(document.createTextNode('Set ' + set_count));
		
		new_fieldset.appendChild(legend);
		
		var new_column_wrapper_div = document.createElement('div');
			new_column_wrapper_div.setAttribute('class','cols');
		
		// list of access modes to add to the set
		var access_modes = ['auditory','tactile','textual','visual'];
		
		for (var i = 0; i < access_modes.length; i++) {
			var access_mode_label = document.createElement('label');
			
			var new_checkbox = document.createElement('input');
				new_checkbox.setAttribute('type', 'checkbox');
				new_checkbox.setAttribute('value', access_modes[i]);
			
			access_mode_label.appendChild(new_checkbox);
			access_mode_label.appendChild(document.createTextNode(' ' + access_modes[i]));
			
			new_column_wrapper_div.appendChild(access_mode_label);
		}
		
		new_fieldset.appendChild(new_column_wrapper_div);
		
		// get the link to add new sufficient modes
		var add_sufficient_set_link = document.getElementById('add-accessModeSufficient');
		
		// insert the new set before the link
		add_sufficient_set_link.parentNode.insertBefore(new_fieldset, add_sufficient_set_link);
	}
	
	
	
	/* generates a summary from the result of the evaluation and any filled-in metadata fields */
	
	function generateAccessibilitySummary(opt) {
		
		opt ||= {};
		var wizard = opt.hasOwnProperty('wizard') && opt.wizard ? true : false;
		var summary_field = document.getElementById('accessibilitySummary');
		var summary_text = '';
		
		var epub_version = document.getElementById('epub-a11y').value;
		
		// add the evaluation status
		
		var eval_status = document.getElementById('conformance-result').value;
		
		if (!eval_status || eval_status == 'incomplete') {
			summary_text = smart_ui.discovery.generateSummary.incomplete[smart_lang].replace('%VER%', epub_version);
		}
		
		else if (eval_status == 'fail') {
			summary_text = smart_ui.discovery.generateSummary.fail[smart_lang].replace('%VER%', epub_version);
		}
		
		else {
			/*
				summary_text = smart_ui.discovery.generateSummary.pass[smart_lang].replace('%VER%', epub_version);
				summary_text += ' ' + smart_ui.discovery.generateSummary.wcagLevel[smart_lang].replace('%VER%', smartWCAG.WCAGVersion()) + ' ' + smartWCAG.WCAGLevel().toUpperCase() + '.';
			*/
		}
		
		// indicate if the publication is screen reader friendly (AMS=textual) or has pre-recorded narration (AMS=auditory)
		
		var sufficient_fields = document.querySelectorAll('fieldset#accessModeSufficient fieldset');
		var sufficient_list = new Array();
		
		// filter out AMS combinations that are unnecessary to report (typically visual)
		
		for (var j = 0; j < sufficient_fields.length; j++) {
			var checked_items = sufficient_fields[j].querySelectorAll('input:checked');
			if (checked_items.length == 1) {
				if (checked_items[0].value == 'textual' || checked_items[0].value == 'auditory') {
					sufficient_list.push(checked_items[0].value);
				}
			}
		}
		
		if (sufficient_list.length > 0) {
			summary_text += ' ' + smart_ui.discovery.generateSummary.publication[smart_lang] + ' ';
			
			if (sufficient_list.length == 1) {
				summary_text += smart_ui.discovery.generateSummary.sufficientTranslation[sufficient_list[0]][smart_lang];
			}
			
			else {
				summary_text += smart_ui.discovery.generateSummary.sufficientTranslation.textual[smart_lang] + ' ' + smart_ui.discovery.generateSummary.listItemCombine[smart_lang] + ' ' + smart_ui.discovery.generateSummary.sufficientTranslation.auditory[smart_lang];
			}
			
			summary_text += '.';
		}
		
		// list only a select set of features - the ones readers are most interested in
		
		var feature_items = document.querySelectorAll('fieldset#accessibilityFeature input:checked');
		var feature_list = new Array();
		
		var addFeature = {
			'alternativetext': 1,
			'longdescription': 1,
			'captions': 1,
			'transcript': 1,
			'mathml': 1
		};
		
		// filter out all the lower-priority features 
		
		for (var k = 0; k < feature_items.length; k++) {
			if (addFeature[feature_items[k].value.toLowerCase()]) {
				feature_list.push(feature_items[k]);
			}
		}
		
		if (feature_list.length > 0) {
			summary_text += ' ' + smart_ui.discovery.generateSummary.featureStart[smart_lang] + ' ';
			summary_text += stringify_metadata_values(feature_list);
			summary_text += '.';
		}
		
		// only list hazards if there are actually some present (i.e., ignore "none" and "unknown")
		
		var hazard_items = document.querySelectorAll('fieldset#accessibilityHazard input:checked');
		var hazard_list = new Array();
		
		var isHazard = {
			'flashing': 1,
			'sound': 1,
			'motionsimulation': 1
		};
		
		// filter out non-hazard values
		
		for (var k = 0; k < hazard_items.length; k++) {
			if (isHazard[hazard_items[k].value.toLowerCase()]) {
				hazard_list.push(hazard_items[k]);
			}
		}
		
		if (hazard_list.length > 0) {
			if (hazard_list.length == 1) {
				var hazard = hazard_list[0].parentNode.textContent.trim().toLowerCase();
				summary_text += ' ' + smart_ui.discovery.generateSummary.singleHazard[smart_lang].replace('%%val%%', hazard);
			}
			else {
				summary_text += ' ' + smart_ui.discovery.generateSummary.multiHazard[smart_lang] + ' ';
				summary_text += stringify_metadata_values(hazard_list);
				summary_text += '.';
			}
		}
		
		if (wizard) {
			return summary_text;
		}
		
		else {
			if (summary_text === '') {
				alert(smart_errors.summaryGenerator.failed[smart_lang]);
			}
			else {
				summary_field.value = summary_text;
			}
		}
	}
	
	
	// takes an array of checkboxes and uses the text content of their parent labels to generate a human-readable string
	
	function stringify_metadata_values(checked_items) {
		var value_str = '';
		for (var i = 0; i < checked_items.length; i++) {
			value_str += checked_items[i].parentNode.textContent.trim();
			value_str += (checked_items.length == 2 && i == 0) ? ' and ' : (checked_items.length > 2 && i == checked_items.length - 2) ? ', and ' : ((i != checked_items.length-1) ? ', ' : '');
		}
		return value_str;
	}
	
	
	return {
		addDiscoveryMetadata: function() {
			addDiscoveryMetadata();
		},
		
		addCustomFeature: function(feature_name) {
			addCustomFeature(feature_name);
		},
		
		addNewSufficientSet: function() {
			addNewSufficientSet();
		},
		
		validateDiscoveryMetadata: function() {
			return validateDiscoveryMetadata(false);
		},
		
		generateAccessibilityMetadata: function(format) {
			generateAccessibilityMetadata(format);
		},
		
		generateAccessibilitySummary: function(opt) {
			return generateAccessibilitySummary(opt);
		}
	}

})();
