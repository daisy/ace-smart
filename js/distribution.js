
'use strict';

/* 
 * 
 * smartDistribution
 * 
 * Validates and generates ONIX accessibility metadata
 * 
 * Public functions:
 * 
 * - generateONIXMetadata - checks validity and generates tags for use in an ONIX record 
 * 
 */

var smartDistribution = (function() {
	
	/* checks for inconsistencies in the metadata and that URLs are formatted correctly  */
	function validateONIXMetadata() {
		
		smartError.clearAll('distribution');
		
		var is_valid = true;
		
		var lia = document.getElementById('onix01').checked;
		var epub10_a = document.getElementById('onix02').checked;
		var epub10_aa = document.getElementById('onix03').checked;
		var epub11 = document.getElementById('onix04').checked;
		var unknown = document.getElementById('onix08').checked;
		var inaccess = document.getElementById('onix09').checked;
		var micro = document.getElementById('onix75').checked;
		var burden = document.getElementById('onix76').checked;
		var mod = document.getElementById('onix77').checked;
		var wcag20 = document.getElementById('onix80').checked;
		var wcag21 = document.getElementById('onix81').checked;
		var wcag22 = document.getElementById('onix82').checked;
		var levela = document.getElementById('onix84').checked;
		var levelaa = document.getElementById('onix85').checked;
		var levelaaa = document.getElementById('onix86').checked;
		
		/* check that exemptions are not selected with conformance */
		if ((lia || epub10_a || epub10_aa || epub11) && (micro)) {
			smartError.logError({tab_id: 'distribution', element_id: 'onix75', severity: 'warn', message: smart_errors.validation.distribution.eaaConflict[smart_lang]});
			smartFormat.setFieldToError({id: 'onix75', is_warning: true, highlight_parent: true});
			is_valid = false;
		} 
		if ((lia || epub10_a || epub10_aa || epub11) && (burden)) {
			smartError.logError({tab_id: 'distribution', element_id: 'onix76', severity: 'warn', message: smart_errors.validation.distribution.eaaConflict[smart_lang]});
			smartFormat.setFieldToError({id: 'onix76', is_warning: true, highlight_parent: true});
			is_valid = false;
		} 
		if ((lia || epub10_a || epub10_aa || epub11) && (mod)) {
			smartError.logError({tab_id: 'distribution', element_id: 'onix77', severity: 'warn', message: smart_errors.validation.distribution.eaaConflict[smart_lang]});
			smartFormat.setFieldToError({id: 'onix77', is_warning: true, highlight_parent: true});
			is_valid = false;
		} 
		
		/* check that any URLs begin with http(s):// */
		for (var i = 93; i < 97; i++) {
			var url = document.getElementById('onix'+i).value;
			if (url) {
				if (!url.match(/^https?:\/\//i)) {
					smartError.logError({tab_id: 'distribution', element_id: 'onix'+i, severity: 'err', message: smart_errors.validation.distribution.nonURL.replace('%%val%%',i)});
					smartFormat.setFieldToError({id: 'onix'+i, is_warning: false, highlight_parent: true});
					is_valid = false;
				}
			}
		}
		
		return is_valid;
	}
	
	
	return {
	}

})();
