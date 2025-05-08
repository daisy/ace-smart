
'use strict';

/* 
 * 
 * smartEvaluation
 * 
 * Verifies and outputs evaluation metadata
 * 
 * Public functions
 * 
 * - validateEvaluationMetadata - verifies required evaluation metadata is present and checks format of links
 * 
 * - generateEvaluationMetadata - generate package document metadata tags from evaluator information 
 * 
 */

var smartEvaluation = (function() {
	
	/* checks the evaluator name the report link */
	function validateEvaluationMetadata(clear) {
		
		if (clear) {
			smartError.clearAll('evaluation');
		}
		
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
		validateEvaluationMetadata: function() {
			return validateEvaluationMetadata(false);
		}
	}

})();
