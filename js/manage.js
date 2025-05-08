
'use strict';

/* 
 * 
 * smartManage
 * 
 * Manages saving and loading in-progress evaluations
 * 
 * Public functions
 * 
 * - saveConformanceEvaluation - writes a json object with the current evaluation data
 * 
 * - loadConformanceEvaluation - reads in a saved object and populates the form
 * 
 */

var smartManage = (function() {
	
	/* 
	 * creates the json object that is then saved either into the db
	 * on the server or downloaded to the users computer
	 * 
	 * the resulting object is structured as follows:
	 * 
	 * {
	 *     "version": "1.0",
	 *     "category": "savedEvaluation",
	 *     "created": "...",
	 *     "configuration": {
	 *        ...
	 *     },
	 *     "publicationInfo": {
	 *        ...
	 *     },
	 *     "conformance": [
	 *        ...
	 *     ],
	 *     "discovery": {
	 *        ...
	 *     },
	 *     "distribution": {
	 *        ...
	 *     },
	 *     "evaluation": {
	 *        ...
	 *     }
	 *     ... extensions ...
	 * }
	 * 
	 * 
	 */
	
	function saveConformanceEvaluation(location) {
	
		var evaluationJSON = {};
		
		evaluationJSON.version = '1.1';
		evaluationJSON.category = 'savedEvaluation';
		evaluationJSON.id = ACE_ID;
		
		var now = new Date();
		evaluationJSON.created = now.toISOString();
		
		/* store report configuration info */
		
		evaluationJSON.configuration = {};
			
			evaluationJSON.configuration.epub = {}
				evaluationJSON.configuration.epub.format = document.querySelector('select#epub-format').value;
				evaluationJSON.configuration.epub.a11y =  document.querySelector('select#epub-a11y').value;
			
			evaluationJSON.configuration.wcag = {};
				evaluationJSON.configuration.wcag.version = document.querySelector('select#wcag-version').value;
				evaluationJSON.configuration.wcag.level = document.querySelector('select#wcag-level').value;
				evaluationJSON.configuration.wcag.show_aa = (document.getElementById('show-aa').checked ? 'true' : 'false');
				evaluationJSON.configuration.wcag.show_aaa = (document.getElementById('show-aaa').checked ? 'true' : 'false');
		
			/* excluded content types array */
			var excluded_test_types = document.querySelectorAll('#exclusions input[type="checkbox"]:checked');
			evaluationJSON.configuration.exclusions = [];
			
			if (excluded_test_types) {
				for (var i = 0; i < excluded_test_types.length; i++) {
					evaluationJSON.configuration.exclusions.push(excluded_test_types[i].value);
				}
			}
			
			/* sc to hide by status */
			var sc_hide_status = document.querySelectorAll('#hide-status input[type="checkbox"]:checked');
			evaluationJSON.configuration.hide_status = [];
			
			if (excluded_test_types) {
				for (var i = 0; i < sc_hide_status.length; i++) {
					evaluationJSON.configuration.hide_status.push(sc_hide_status[i].value);
				}
			}
			
			/* list of fallbacks */
			var fallbacks = document.querySelectorAll('#fallbacks > ul#fallback-types > li.listitem');
			
			evaluationJSON.configuration.fallbacks = [];
			if (fallbacks) {
				for (var i = 0; i < fallbacks.length; i++) {
					fallbacks[i].classList.forEach(function(value, key, listObj) {
						if (value != 'listitem') {
							evaluationJSON.configuration.fallbacks.push(value);
						}
					});
				}
			}
	
		/* add publication info */
		
		evaluationJSON.publicationInfo = {};
		evaluationJSON.publicationInfo.title = document.getElementById('title').value;
		evaluationJSON.publicationInfo.creator = document.getElementById('creator').value;
		evaluationJSON.publicationInfo.identifier = document.getElementById('identifier').value;
		evaluationJSON.publicationInfo.modified = document.getElementById('modified').value;
		evaluationJSON.publicationInfo.publisher = document.getElementById('publisher').value;
		evaluationJSON.publicationInfo.date = document.getElementById('date').value;
		evaluationJSON.publicationInfo.description = document.getElementById('description').value;
		evaluationJSON.publicationInfo.subject = document.getElementById('subject').value;
		evaluationJSON.publicationInfo['optional-meta'] = document.getElementById('optional-meta').value;
		
		/* add success criteria state */
		
		var success_criteria = document.querySelectorAll('.a, .aa, .aaa, .epub');
		
		evaluationJSON.conformance = [];
		
			for (var i = 0; i < success_criteria.length; i++) {
				
				var status = document.querySelector('input[name="'+success_criteria[i].id+'"]:checked').value;
				
				evaluationJSON.conformance[i] = {};
				evaluationJSON.conformance[i].id = success_criteria[i].id;
				evaluationJSON.conformance[i].status = status;
				
				if (status == 'fail') {
					evaluationJSON.conformance[i].error = document.getElementById(success_criteria[i].id+'-err').value;
				}
				
				if ((document.getElementsByName(success_criteria[i].id+'-notebox'))[0].checked) {
					evaluationJSON.conformance[i].note = document.getElementById(success_criteria[i].id+'-info').value;
				}
			}
		
		/* add discovery metadata */
		
		evaluationJSON.discovery = {};
		
			var a11yFields = new Array('accessibilityFeature','accessibilityHazard','accessMode');
			
			a11yFields.forEach( function(id) {
				evaluationJSON.discovery[id] = saveDiscoveryMeta(id);
			});
			
			evaluationJSON.discovery.accessibilitySummary = document.getElementById('accessibilitySummary').value.trim();
			evaluationJSON.discovery.accessModeSufficient = saveSufficientSets();
		
		/* add conformance metadata */
		
		evaluationJSON.evaluation = {};
		
			evaluationJSON.evaluation.result = document.getElementById('conformance-result-status').textContent;
			
			evaluationJSON.evaluation.certifiedBy = document.getElementById('certifiedBy').value;
			
			evaluationJSON.evaluation.certifierCredential = document.getElementById('certifierCredential').value;
			
			evaluationJSON.evaluation.certifierReport = document.getElementById('certifierReport').value;
		
		/* add extension data */
		
		if (Object.keys(smart_extensions).length > 0) {
			for (var key in smart_extensions) {
				if (!evaluationJSON.hasOwnProperty(key)) {
					evaluationJSON[key ]= smart_extensions[key].saveData();
				}
				else {
					console.log('Extension ' + key + ' matches an existing report property name. Data cannot be saved until a new name is selected.');
				}
			}
		}
		
		/* store the json to the location specified by the user */
		
		(location == 'local') ? 
			writeSavedJSON(JSON.stringify(evaluationJSON)) : 
			storeSavedJSON(JSON.stringify(evaluationJSON));
		
	}
	
	
	
	/* returns an array of checked discovery metadata values */
	
	function saveDiscoveryMeta(id) {
		var metaArray = [];
		var checkedItems = document.querySelectorAll('fieldset#' + id + ' input:checked');
		
		if (checkedItems.length > 0) {
			for (var i = 0; i < checkedItems.length; i++) {
				metaArray.push(checkedItems[i].value);
			}
		}
		
		return metaArray;
	}
	
	
	/* returns an object containing sets of sufficientAccessModes */
	
	function saveSufficientSets(id) {
		var setObject = {};
		
		var sufficientSets = document.getElementById('accessModeSufficient').getElementsByTagName('fieldset');
		
		for (var i = 0; i < sufficientSets.length; i++) {
			var checkedAccessModes = sufficientSets[i].querySelectorAll('input:checked');
			
			if (checkedAccessModes.length > 0) {
				setObject['set'+i] = [];
					for (var j = 0; j < checkedAccessModes.length; j++) {
						setObject['set'+i].push(checkedAccessModes[j].value);
					}
			}
		}
		
		return setObject;
	}
	
	
	
	/* 
	 * creates the json download of saved evaluation
	 * - dynamically creates a form with the json and posts it to save.php to initiate the download in a new tab
	 */
	
	function writeSavedJSON(evaluationJSON) {
		var eval_form = document.createElement('form');
			eval_form.target = '_blank';    
			eval_form.method = 'POST';
			eval_form.action = 'save.php';
		
		var eval_user = document.createElement('input');
			eval_user.type = 'hidden';
			eval_user.name = 'u';
			eval_user.value = ACE_USER;
		eval_form.appendChild(eval_user);
		
		var eval_company = document.createElement('input');
			eval_company.type = 'hidden';
			eval_company.name = 'c';
			eval_company.value = ACE_USER_CO;
		eval_form.appendChild(eval_company);
		
		var eval_shared = document.createElement('input');
			eval_shared.type = 'hidden';
			eval_shared.name = 'shared';
			eval_shared.value = ACE_SHARED;
		eval_form.appendChild(eval_shared);
		
		var eval_title = document.createElement('input');
			eval_title.type = 'hidden';
			eval_title.name = 't';
			eval_title.value = document.getElementById('title').value;
		eval_form.appendChild(eval_title);
		
		var eval_id = document.createElement('input');
			eval_id.type = 'hidden';
			eval_id.name = 'id';
			eval_id.value = ACE_ID;
		eval_form.appendChild(eval_id);
		
		var eval_data = document.createElement('input');
			eval_data.type = 'hidden';
			eval_data.name = 'evaluation';
			eval_data.value = evaluationJSON;
		eval_form.appendChild(eval_data);
		
		var eval_location = document.createElement('input');
			eval_location.type = 'hidden';
			eval_location.name = 'location';
			eval_location.value = 'file';
		eval_form.appendChild(eval_location);
		
		document.body.appendChild(eval_form);
		eval_form.submit();
		eval_form.parentNode.removeChild(eval_form);

    	saveChanges = false;
    	firstSave = false;
		save_dialog.dialog('close');
	
	}
	
	
	/* 
	 * ajax call to store the evaluation json on the server
	 * - basically the same as the download function, but uses an ajax call to send the data to save.php and store in the db without leaving the current page
	 */
	
	function storeSavedJSON(evaluationJSON) {
		
		$.ajax(
		{
			url: 			'save.php',
			type:			'POST',
			data: 			jQuery.param({ 
								'u': ACE_USER,
								'c': ACE_USER_CO,
								'shared': ACE_SHARED,
								't': document.getElementById('title').value,
								'id': ACE_ID,
								'evaluation': evaluationJSON,
								'location': 'db'
							}),
			contentType:    'application/x-www-form-urlencoded; charset=UTF-8',
			cache:			false,
			processData:	false,
			complete: function()
			{
				// no actions defined
			},
			success: function( data )
			{
				try {
					var response = JSON.parse(data);
					if (response.error) {
						alert(response.error);
					}
					else {
    					saveChanges = false;
    					firstSave = false;
						save_dialog.dialog('close');
						alert(response.status);
					}
				}
				
				catch (error) {
					alert(smart_ui.manage.serverError.unknown[smart_lang]);
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				alert(smart_ui.manage.serverError.contact[smart_lang]);
			}
		});
	}
	
	
	/* reloads the saved evaluation json */
	
	function loadConformanceEvaluation(evaluationJSON) {
	
		/* load the success criteria */
		
		if (evaluationJSON.hasOwnProperty('conformance')) {
			for (var i = 0; i < evaluationJSON.conformance.length; i++) {
			
				var sc = evaluationJSON.conformance[i];
				
				if (!document.getElementById(evaluationJSON.conformance[i].id)) {
					// account for the splitting of the EPUB SCs into three in the 1.1 revision
					if (sc.id == 'eg-1') {
						alert('Evaluation contains the old EPUB Page Navigation success criterion.\n\nThe old assessment is reported in the new Page Source criterion. Please check the accuracy as there are now multiple parts.');
						
						var new_sc = new Object();
							new_sc.id = 'epub-pagesrc';
							new_sc.status = sc.status;
						
						if (sc.hasOwnProperty('error')) {
							new_sc.error = sc.error;
						}
						if (sc.hasOwnProperty('note')) {
							new_sc.note = sc.note;
						}
						
						sc = new_sc;
					}
					
					else if (sc.id == 'eg-2') {
						alert('Evaluation contains the old EPUB Media Overlays success criterion.\n\nThe old assessment is reported in the new Skippability criterion. Please check the accuracy as there are now multiple parts.');
						
						var new_sc = new Object();
							new_sc.id = 'epub-mo-skip';
							new_sc.status = sc.status;
						
						if (sc.hasOwnProperty('error')) {
							new_sc.error = sc.error;
						}
						if (sc.hasOwnProperty('note')) {
							new_sc.note = sc.note;
						}
						
						sc = new_sc;
					}
					else {
						alert('Failed to load unknown success criterion: ' + evaluationJSON.conformance[i].id + '\n\nPlease report this issue.');
						continue;
					}
				}
				
				document.getElementById(sc.id + '-' + sc.status).checked = true;
				smartConformance.setSCStatus({name: sc.id, value: sc.status});
				
				if (sc.hasOwnProperty('error')) {
					document.getElementById(sc.id+'-err').value = sc.error;
				}
				
				if (sc.hasOwnProperty('note')) {
					var note = document.getElementById(sc.id + '-notebox'); 
					note.checked = true;
					smartConformance.showSCNoteField(note);
					document.getElementById(sc.id + '-info').value = sc.note;
				}
			}
		}
		
		/* load the discovery metadata */
		
		if (evaluationJSON.hasOwnProperty('discovery')) {
			var discovery_checkbox_fields = ['accessibilityFeature','accessibilityHazard','accessMode'];
			
			discovery_checkbox_fields.forEach(function(id) {
				if (evaluationJSON.discovery.hasOwnProperty(id)) {
					setDiscoveryMetaCheckbox(id,evaluationJSON.discovery[id]);
				}
			});
			
			if (evaluationJSON.discovery.hasOwnProperty('accessibilitySummary')) {
				document.getElementById('accessibilitySummary').value = evaluationJSON.discovery.accessibilitySummary;
			}
			
			if (evaluationJSON.discovery.hasOwnProperty('accessModeSufficient')) {
				setSufficientModes(evaluationJSON.discovery.accessModeSufficient);
			}
		}
		
		/* 
		 * load onix metadata
		 * 
		 * NOTE: This code is only retained for old evaluations created when there
		 * 		was a separate tab for distribution metadata. 
		*/
		
		if (evaluationJSON.hasOwnProperty('distribution')) {
		
			var feature_map = {
				"14": "alternativeText",
				"18": "ChemML",
				"12": "index",
				"15": "longDescription",
				"17": "MathML",
				"19": "pageBreakMarkers",
				"13": "readingOrder",
				"20": "synchronizedAudioText",
				"11": "tableOfContents",
				"21": "ttsMarkup"
			}
			
			if (evaluationJSON.distribution.hasOwnProperty('onix')) {
			
				for (var onix_id in evaluationJSON.distribution.onix) {
					
					var padded_id = onix_id.padStart(2,'0');
					
					if (onix_id == 0 || onix_id > 90) {
						// document.getElementById('onix' + padded_id).value = evaluationJSON.distribution.onix.hasOwnProperty(padded_id) ? evaluationJSON.distribution.onix[padded_id] : '';
					}
					
					else {
						if (evaluationJSON.distribution.onix[padded_id]) {
							var id = feature_map[padded_id];
							var input = document.querySelector('#accessibilityFeature input[value="' + id + '"]');
							if (input && !input.checked) {
								input.checked = true;
							}
						}
					}
				}
			}
		}
		
		/* load evaluation and publication text fields */
		
		var text_fields = {
			publicationInfo: ['title', 'creator', 'identifier', 'modified', 'publisher', 'description', 'date', 'subject', 'optional-meta'],
			evaluation: ['certifiedBy','certifierCredential','certifierReport']
		};
		
		for (var key in text_fields) {
			if (evaluationJSON.hasOwnProperty(key)) {
				text_fields[key].forEach(function(id) {
					if (evaluationJSON[key].hasOwnProperty(id)) {
						document.getElementById(id).value = evaluationJSON[key][id];
					}
				});
			}
		}
		
		if (evaluationJSON.hasOwnProperty('evaluation') && evaluationJSON.evaluation.hasOwnProperty('result')) {
			smartConformance.setEvaluationResult();
		}
		
		/* load configuration info */
		
		if (evaluationJSON.hasOwnProperty('configuration')) {
			
			// set the version of the epub accessibility spec being tested - property did not exist in the 1.0 storage format so equates to EPUB A11Y 1.0
			
			var a11y_version = evaluationJSON.version == '1.0' ? '1.0' : evaluationJSON.configuration.epub.a11y;
			
			document.getElementById('epub-a11y').value = a11y_version;
			
			smartConformance.setEPUBA11yVersion(a11y_version);
			
			// set the version and level of wcag being tested
			
			document.getElementById('wcag-level').value = evaluationJSON.configuration.wcag.level;
			
			smartWCAG.setWCAGLevel(evaluationJSON.configuration.wcag.level);
			
			var wcag_version = evaluationJSON.configuration.wcag.version;
			
			if (!wcag_version) { wcag_version = '2.1'; }
			
			document.getElementById('wcag-version').value = wcag_version;
			
			smartConformance.setWCAGVersion(wcag_version);
			
			if ((evaluationJSON.configuration.wcag.show_aa && evaluationJSON.configuration.wcag.show_aa == 'true') && evaluationJSON.configuration.wcag.level != 'aa') {
				document.getElementById('show-aa').click();
			}
			
			if (evaluationJSON.configuration.wcag.show_aaa && evaluationJSON.configuration.wcag.show_aaa == 'true') {
				document.getElementById('show-aaa').click();
			}
			
			// account for old epub_format property - delete when safely out of use
			var epub_format = evaluationJSON.version == '1.0' ? evaluationJSON.configuration.epub_format : evaluationJSON.configuration.epub.format; 
			
			document.getElementById('epub-format').value = epub_format;
			
			smartFormat.setEPUBVersion(epub_format);
			
			// reset excluded test status - only need to check not click as the n/a setting will already be saved for each sc
			if (evaluationJSON.configuration.hasOwnProperty('exclusions') && evaluationJSON.configuration.exclusions) {
				evaluationJSON.configuration.exclusions.forEach(function(value) {
					document.getElementById('excl-' + value).checked = true;
					smartConformance.configureContentTypeTests({
						type: value,
						exclude: true
					});
				});
			}
			
			// hide sc by status - need to click to re-hide
			if (evaluationJSON.configuration.hasOwnProperty('hide_status') && evaluationJSON.configuration.hide_status) {
				evaluationJSON.configuration.hide_status.forEach(function(value) {
					document.querySelector('#hide-status input[value="' + value + '"]').click();
				});
			}
			
			if (evaluationJSON.configuration.hasOwnProperty('fallbacks') && evaluationJSON.configuration.fallbacks.length > 0) {
				document.querySelector('#fallbacks').classList.add('visible');
				evaluationJSON.configuration.fallbacks.forEach(function(value) {
					var listitems = document.querySelectorAll('#fallbacks li.' + value);
					for (var i = 0; i < listitems.length; i++) {
						listitems[i].classList.add('listitem');
					}
				});
			}
		}
		
		/* load extension data */
		if (Object.keys(smart_extensions).length > 0) {
			for (var key in smart_extensions) {
				smart_extensions[key].loadData(evaluationJSON);
			}
		}
	}
	
	
	/* generic function that clicks a checkbox for a metadata field */
	
	function setDiscoveryMetaCheckbox(id,obj) {
	
		for (var i = 0; i < obj.length; i++) {
			
			var obj_value = obj[i];
			
			// OVERRIDES - change deprecated values to replacements
			
			switch (obj_value) {
				case 'captions':
					obj_value = 'closedCaptions';
					break;
				
				case 'printPageMarkers':
					obj_value = 'pageBreakMarkers';
					break;
			}
			
			var checkbox = document.querySelector('#' + id + ' input[value="' + obj_value + '"]');
			
			if (checkbox === null) {
				/* ignore except for accessibilityFeature, as indicates a user-defined feature */
				if (id == 'accessibilityFeature') {
					smartDiscovery.addCustomFeature(obj[i]);
				}
			}
			else {
				checkbox.checked = true;
			}
		}
	}
	
	
	/* generic function to set the modes for an accessModeSufficient set */
	
	function setSufficientModes(modeSets) {
		/* add any additional sets before loading */
		var setCount = Object.keys(modeSets).length;
		if (setCount > 2) {
			for (var j = 1; j <= setCount - 2; j++) {
				smartDiscovery.addNewSufficientSet();
			}
		}
		
		var sufficient_fields = document.querySelectorAll('#accessModeSufficient fieldset');
		
		var set_counter = 0;
		for (var set_id in modeSets) {
			modeSets[set_id].forEach(function(sufficient_mode) {
				sufficient_fields[set_counter].querySelector('input[value="' + sufficient_mode + '"]').checked = true;
			});
			set_counter += 1;
		}
	}
	
	
	return {
	
		saveConformanceEvaluation: function(location) {
			saveConformanceEvaluation(location);
		},
		
		loadConformanceEvaluation: function(data){
			loadConformanceEvaluation(data);
		}
	}

})();
