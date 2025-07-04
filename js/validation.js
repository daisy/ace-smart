'use strict';

/* 
 * 
 * smartValidation
 * 
 * Validates the form tabs
 * 
 * Public functions
 * 
 * - validatePublicationMetadata - validates the publication information input in the first tab
 * 
 * - validateSuccessCriteria - verifies that all the success criteria have been set to a value other then unverified
 * 
 * - validateAccessibilityMetadata - verifies that there is no missing or conflicting accessibility metadata
 * 
 * - validateEvaluationMetadata - verifies the evaluator and evaluation metadata is set  
 * 
 */

var smartValidation = (function() { 

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
	
	
	/* 
	 * Check the metadata input in the publication info tab
	 */
	
	function validatePublicationMetadata() {
		var is_valid = true;
		
		is_valid = validateRequiredPubMetadata() ? is_valid : false;
		is_valid = validateOptionalPubMetadata() ? is_valid : false;
		
		return is_valid;
	}
	
	
	/* 
	 * checks that the title and last modified fields have been set
	 * as these are needed to identify the publication and what version
	 * (by its date) was tested (e.g., in case someone reviewing the report
	 * has a newer, possibly improved, version)
	 * 
	 */
	
	function validateRequiredPubMetadata() {
		var is_valid = true;
		
		for (var meta_name in smart_ui.pubinfo.required_fields) {
			var meta_element = document.getElementById(meta_name);
			
			if (meta_element.value.trim() == '') {
				smartError.logError({tab_id: 'start', element_id: meta_name, severity: 'err', message: smart_errors.validation.pubinfo.required[smart_lang].replace('%%val%%', smart_ui.pubinfo.required_fields[meta_name][smart_lang])});
				smartFormat.setFieldToError({id: meta_name, is_warning: false, highlight_parent: true});
				is_valid = false;
			}
			
			else {
				smartFormat.setFieldToPass({id: meta_name, highlight_parent: true});
			}
		}
		
		return is_valid;
	}
	
	
	/* 
	 * this function only checks the optional metadata input box to
	 * ensure that any inputted text has been formatted properly
	 * - it does not verify the optional metadata fields
	 */
	
	function validateOptionalPubMetadata() {
		var is_valid = true;
		
		var optional_meta_element = document.getElementById('optional-meta');
		var optional_meta_value = optional_meta_element.value.trim();
		
		if (optional_meta_value != '') {
		
			var meta_lines = optional_meta_value.replace(/\r\n/g,'\n').split('\n');
			var meta_error = false;
			
			for (var i = 0; i < meta_lines.length; i++) {
				if (!meta_lines[i].match(/: /)) {
					smartError.logError({tab_id: 'start', element_id: 'optional-meta', severity: 'err', message: smart_errors.validation.pubinfo.noSeparator[smart_lang].replace('%%val%%', (i+1))});
					smartFormat.setFieldToError({id: 'optional-meta', highlight_parent: true});
					is_valid = false;
					meta_error = true;
				}
			}
			
			if (!meta_error) {
				smartFormat.setFieldToPass({id: 'optional-meta', highlight_parent: true});
			}
		}
		
		else {
			smartFormat.setFieldToPass({id: 'optional-meta', highlight_parent: true});
		}
		
		return is_valid;
	}
	
	
	/* ********** END OF PUBLICATION METADATA CHECKS ***************** */
	


	
	
	/* 
	 * Verify that there are no unverified success criteria
	 */
	
	function validateSuccessCriteria() {
	
		var selector = smartConformance.getSCStatusSelector({status: 'unverified', level: 'all', includeEPUB: true});
		
		var unverified_success_criteria = document.querySelectorAll(selector);
		
		if (unverified_success_criteria.length > 0) {
			for (var i = 0; i < unverified_success_criteria.length; i++) {
				smartError.logError({tab_id: 'conformance', element_id: unverified_success_criteria[i].name, severity: 'err', message: smart_errors.validation.pubinfo.unverifiedSC[smart_lang].replace('%%val%%', unverified_success_criteria[i].name.replace('sc-',''))});
			}
			
			return false;
		}
		
		return true;
	}


	/* 
	 * Verify the accessibility metadata
	 */
	
	function validateAccessibilityMetadata() {
	
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
	
	
	function checkURL(url) {
		if (!url.match(/^https?:\/\//i)) {
			// smartError.logError({tab_id: 'distribution', element_id: 'onix'+i, severity: 'err', message: smart_errors.validation.distribution.nonURL.replace('%%val%%',i)});
			return false;
		}
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
	
	/* ***************** END OF ACCESSIBILITY METADATA CHECKS **************************** */


	
	/* 
	 * Check the evaluation metadata
	 */
	
	function validateEvaluationMetadata() {
		
		var is_valid = true;
		
		// check that the certifier's name has been set
		if (document.getElementById('certifiedBy').value.trim() == '') {
			smartError.logError({tab_id: 'evaluation', element_id: 'certifiedBy', severity: 'err', message: smart_errors.validation.evaluation.noCertifier[smart_lang]});
			smartFormat.setFieldToError({id: 'certifiedBy', is_warnign: true, highlight_parent: true});
			is_valid = false;
		}
		
		else {
			smartFormat.setFieldToPass({id: 'certifiedBy', highlight_parent: true});
		}
		
		//check that tht certifier report link begins with http(s)://
		var links = { 'certifierReport': 'Report link' }
		
		for (var id in links) {
		
			var link_value = document.getElementById(id).value.trim();
			
			if (link_value != '' && !link_value.match(/^https?:\/\//i)) {
				smartError.logError({tab_id: 'evaluation', element_id: id, severity: 'warn', message: smart_errors.validation.evaluation.nonURL.replace('%%val%%',links[id])});
				smartFormat.setFieldToError({id: id, is_warning: true, highlight_parent: true});
				is_valid = false;
			}
			
			else {
				smartFormat.setFieldToPass({id: id, highlight_parent: true});
			}
		}
		
		return is_valid;
	}
	
	
	
	return {
	
		validatePublicationMetadata: function() {
			return validatePublicationMetadata();
		},
		
		validateSuccessCriteria: function() {
			return validateSuccessCriteria();
		},
		
		validateAccessibilityMetadata: function() {
			return validateAccessibilityMetadata();
		},
		
		validateEvaluationMetadata: function() {
			return validateEvaluationMetadata();
		}
	}

})();

