
'use strict';

/* 
 * 
 * smartConformance
 * 
 * Controls the display and validation of success criteria
 * 
 * Public functions:
 * 
 * - setEvaluationResult - sets the result based on the epub/wcag versions conformed to 
 * 
 * - setWCAGVersion - changes the success criteria to match the selected version of the standard
 * 
 * - setWCAGConformanceLevel - updates the displayed conformance tests to the user-selected level
 * 
 * - getSCStatusSelector - generate a selector for querying the applicable success criteria
 * 
 * - configureContentTypeTests - show/hide success criteria based on the type of content in the publications (audio/video/etc.)
 * 
 * - setGlobalSCStatus - allows all success criteria to be set to the specified status
 * 
 * - setSCStatus - called whenever a success criterion's status field is changed (sets background, conformance result, etc.)
 * 
 * - showSCNoteField - shows the success criterion's note input field when the user clicks the options to add
 * 
 * - filterSCByStatus - allows users to filter out success criteria by their current status
 * 
 * - showSCBody - toggles the visibility of a success criterion's body (explanation and help links)
 * 
 */

var options_dialog;

var smartConformance = (function() {

	var _SC_TYPE = new Object();
		_SC_TYPE.img = ['sc-1.4.9'];
		_SC_TYPE.audio = ['sc-1.4.2', 'sc-1.4.7'];
		_SC_TYPE.video = ['sc-1.2.2', 'sc-1.2.3', 'sc-1.2.5', 'sc-1.2.6', 'sc-1.2.7', 'sc-1.2.8'];
		_SC_TYPE.av = ['sc-1.2.1', 'sc-1.2.4', 'sc-1.2.9'];
		_SC_TYPE.script = [ 'sc-1.3.5',
							'sc-2.2.1', 'sc-2.2.4', 'sc-2.2.5', 'sc-2.2.6',
							'sc-2.5.1', 'sc-2.5.2', 'sc-2.5.3', 'sc-2.5.4', 'sc-2.5.5', 'sc-2.5.6',
							'sc-3.2.1', 'sc-3.2.2', 'sc-3.2.4', 'sc-3.2.5',
							'sc-3.3.1', 'sc-3.3.2', 'sc-3.3.3', 'sc-3.3.4', 'sc-3.3.5', 'sc-3.3.6',
							'sc-4.1.3' ];


		/* 
		 * Mapping used to filter SC by content type
		 * (differs from _SC_TYPE in that not all these SC can be disabled if one media type isn't present)
		 */
		var _SC_MAP = new Object();
			
			_SC_MAP.audio = ['1.1.1', '1.2.1', '1.2.2', '1.2.3', '1.2.5', '1.2.6', '1.2.7', '1.2.8',
							'1.4.2', '1.4.7'];
			
			_SC_MAP.color = ['1.3.3', 
							'1.4.1', '1.4.3', '1.4.6', '1.4.8', '1.4.11',
							'2.4.7'];
			
			_SC_MAP.controls = ['1.3.1', '1.3.2', '1.3.5', '1.3.6',
								'1.4.1',
								'2.1.1', '2.1.2', '2.1.3',
								'2.2.1', '2.2.2', '2.2.3', '2.2.4', '2.2.6', '2.4.3', '2.4.7',
								'2.5.1', '2.5.2', '2.5.3', '2.5.4', '2.5.5', '2.5.6',
								'3.2.1', '3.2.2', '3.2.4', '3.2.5', '3.2.6',
								'3.3.1', '3.3.2', '3.3.3'];
			
			_SC_MAP.hd = ['1.3.1', '2.4.6', '2.4.10'];
			
			_SC_MAP.img = ['1.1.1'];
			
			_SC_MAP.imgtext = ['1.1.1', '1.4.3', '1.4.5', '1.4.6', '1.4.9']
			
			_SC_MAP.input = ['1.3.1', '1.3.2', '1.3.5', '1.3.6',
							'1.4.1', '1.4.3', '1.4.6',
							'2.1.1', '2.1.2', '2.1.3',
							'2.2.5',
							'2.4.3', '2.4.6',
							'2.5.3', '2.5.5',
							'3.2.1', '3.2.2', '3.2.4', '3.2.5',
							'3.3.1', '3.3.2', '3.3.3', '3.3.4', '3.3.5', '3.3.6'];
			
			_SC_MAP.links = ['1.4.1', '2.1.1', '2.4.3', '2.4.4', '2.4.9'];
			
			_SC_MAP.lang = ['3.1.1', '3.1.2'];
			
			_SC_MAP.mo = ['epub-mo-readorder', 'epub-mo-skip', 'epub-mo-esc', 'epub-mo-nav'];
			
			_SC_MAP.page = ['2.4.13', 'epub-pagesrc', 'epub-pagelist', 'epub-pagebreaks'];
			
			_SC_MAP.readorder = ['1.3.2', '2.4.5'];
			
			_SC_MAP.struct = ['1.3.1', '1.3.2'];
			
			_SC_MAP.text = ['1.4.1', '1.4.3', '1.4.4', '1.4.5', '1.4.6', '1.4.8', '1.4.10', '1.4.12',
							'3.1.1', '3.1.2', '3.1.3', '3.1.4', '3.1.5', '3.1.6'];
			
			_SC_MAP.titles = ['2.4.2'];
			
			_SC_MAP.video = ['1.1.1',
							'1.2.1', '1.2.2', '1.2.3', '1.2.5', '1.2.6', '1.2.7', '1.2.8',
							'1.4.2', '1.4.7',
							'2.2.2',
							'2.3.1', '2.3.2'];
		

	/* WCAG mapping levels - starting with 2.2 levels have begun shifting up 
	 * 
	 * Each object in the map has two keys:
	 *  - 'default' contains the initial level it started at
	 *  - 'change' identifies:
	 *    - 'in' - which wcag version the change was made in
	 *    - 'to' - what the new level is
	 */
	
	var _WCAG_MAP = {
		'sc-2.4.7': {
			'level' : {
				'default': 'aa',
				'change' : {
					'in' : 2.2,
					'to' : 'a'
				}
			}
		},
		'sc-2.5.5': {
			'name' : {
				'default': 'Target Size',
				'change' : {
					'in' : 2.2,
					'to' : 'Target Size (Enhanced)'
				}
			}
		},
		'sc-4.1.1': {
			'obsolete' : 2.2
		}
	}
	
	/* changes the form to match the epub accessibility version options */
	
	function setEPUBA11yVersion(version) {
	
		var wcag_ver = document.getElementById('wcag-version');
		
		if (version == '1.1') {
			wcag_ver.disabled = false;
		}
		
		else if (version == '1.0') {
			wcag_ver.value = '2.0';
			wcag_ver.disabled = true;
			setWCAGVersion('2.0',false);
		}
		
		else {
			// unhandled version
			console.log('Unhandled EPUB Accessibility version ' + version);
		}
		
		// recheck conformance
		setEvaluationResult();
	}
	
	/* changes the visible success criteria based on the user setting */
	
	function setWCAGVersion(version, displayAlert) {
		smartWCAG.setWCAGVersion(version);
		adjustWCAGSC(version);
		setWCAGConformanceLevel(smartWCAG.WCAGLevel());
	}
	
	/* adjusts the conformance levels across versions */
	
	function adjustWCAGSC(version) {
		
		for (var key in _WCAG_MAP) {
		
			if (_WCAG_MAP[key].hasOwnProperty('level')) {
				changeSCLevel(key,version);
			}
			
			if (_WCAG_MAP[key].hasOwnProperty('name')) {
				changeSCName(key,version);
			}
			
			if (_WCAG_MAP[key].hasOwnProperty('obsolete')) {
				changeObsoleteSC(key,version);
			}
		} 
	}
	
	
	/* updates the WCAG level for an SC to account for changes by version */
	
	function changeSCLevel(key,version) {
	
		var default_level = _WCAG_MAP[key].level.default;
		var changed_level = _WCAG_MAP[key].level.change.to;
		var isChanged = false;
		
		var level = _WCAG_MAP[key].level.default;
		
		// check if the user is loading a version in which the level has changed
		if (version >= _WCAG_MAP[key].level.change.in) {
			level = changed_level;
			isChanged = true;
		}
		
		// get the SC entry
		var sc = document.getElementById(key);
		
		// make sure the wrong class list isn't present
		if (isChanged) {
			sc.classList.remove(default_level);
		}
		else {
			sc.classList.remove(changed_level);
		}
		
		// add the new class level if not present
		sc.classList.add(level);
		
		// reset the level display label
		var level_span = sc.querySelector('h3 > span:nth-child(2)');
			level_span.setAttribute('class', level + '-label');
			level_span.innerHTML = 'Level ' + level.toUpperCase();
	}
	
	/* updates an SC name to account for changes by WCAG version */
	
	function changeSCName(key,version) {
	
		// get the name that applies to this version
		var name = (version >= _WCAG_MAP[key].name.change.in) ? _WCAG_MAP[key].name.change.to : _WCAG_MAP[key].name.default;
		
		// get the SC entry
		var sc = document.getElementById(key);
		
		// get the SC number
		var sc_num = key.replace('sc-','');
		
		// set the SC name
		var name_span = sc.querySelector('h3 > span.label');
			name_span.innerHTML = sc_num + ' ' + name;
	
	}
	
	/* changes an SC status to/from obsolete */
	
	function changeObsoleteSC(key,version) {
	
		var isObs = version >= _WCAG_MAP[key].obsolete;
		var status = isObs ? 'obsolete' : 'pass';
		var scID = key + '-' + status;
		
		var sc = document.getElementById(scID);
			sc.disabled = false;
			sc.checked = true;
			sc.disabled = true;
		
		setSuccessCriteriaStatus({name: key, value: status});
	}
	
	/* changes the visible success criteria based on the user setting */
	
	function setWCAGConformanceLevel(level) {
	
		smartWCAG.setWCAGLevel(level);
		
		// call the display function to hide/show SC
		displaySuccessCriteria();
		
		// show notes for success criteria that are superseded by a higher-level requirement
		var sup = document.getElementsByClassName('superseded-aa');
		
		for (var i = 0; i < sup.length; i++) {
			if (level == 'aa') {
				sup[i].classList.remove('hidden');
			}
			else {
				sup[i].classList.add('hidden');
			}
		}
		
		smartWCAG.setWCAGClassList();
		
		document.getElementById('show-aa').disabled = (level == 'aa') ? true : false;
		
		// recheck conformance
		setEvaluationResult();
		
		// update the stats box
		setSCStats();
	}
	
	
	/* makes success criteria visible/hidden based on their class */
	
	function displaySuccessCriteria() {
	
		// check if there is a content filter in place
		var filter = null;
		
		var type = document.getElementById('filterSC').value;
		
		if (type != 'all' && _SC_MAP.hasOwnProperty(type)) {
			filter = _SC_MAP[type];
		}
		
		// check if user overrides are set to view aa and/or aaa SC
		
		var hide = false;
		var show_aa = smartWCAG.WCAGLevel() == 'aa' || document.getElementById('show-aa').checked;
		var show_aaa = document.getElementById('show-aaa').checked;
		
		// get the list of supported versions from the dropdown
		
		var wcag_versions = document.getElementById('wcag-version');
		
		for (var i = 0; i < wcag_versions.length; i++) {
		
			// get all the success criteria for the current version
			var success_criteria = document.getElementsByClassName('w' + wcag_versions.options[i].value.replace('.',''));
			
			for (var j = 0; j < success_criteria.length; j++) {
			
				var sc_num = success_criteria[j].id.replace('sc-','');
				var is_aa = success_criteria[j].classList.contains('aa');
				var is_aaa = success_criteria[j].classList.contains('aaa');
				
				/*  hide when:
				 *   - from a version higher than the currently selected version
				 *   - the user wants the aa conformance level hidden
				 *   - the user has not selected to show aaa criteria
				 *   - the SC is not in the list to filter by (i.e., the user-selected content filtering box is applied)
				 */
				
				if ( hide 
					|| (is_aa && !show_aa)
					|| (is_aaa && !show_aaa)) {
					success_criteria[j].classList.remove('visible');
					success_criteria[j].classList.add('hidden');
				}
				
				else {
				
					if (filter !== null && !filter.includes(sc_num)) {
						// check filtered criteria separately so inapplicable rules don't show up
						success_criteria[j].classList.remove('visible');
						success_criteria[j].classList.add('hidden');
					}
					
					else {
						success_criteria[j].classList.remove('hidden');
						success_criteria[j].classList.add('visible');
					}
				}
			}
			
			// if this version of WCAG is the selected version, hide all higher versions
			if (wcag_versions.options[i].value == smartWCAG.WCAGVersion()) {
				hide = true;
			}
		}
		
		// (un)filter the epub criteria

		var epub_sc = document.getElementsByClassName('epub');
		
		for (var e = 0; e < epub_sc.length; e++) {
		
			if (filter != null && !filter.includes(epub_sc[e].id)) {
				epub_sc[e].classList.remove('visible');
				epub_sc[e].classList.add('hidden');
			}
			
			else {
				epub_sc[e].classList.remove('hidden');
				epub_sc[e].classList.add('visible');
			}
		}

		smartWCAG.setWCAGClassList();
		
		// update the stats box
		setSCStats();
	}
	
	
	/* shows/hides sets of content-specific tests */
	function configureContentTypeTests(options) {
	
		// select all content-specific tests
		// applicable tests are identified by a data-scope attribute - e.g. data-scope="audio"
		var checks = document.querySelectorAll('*[data-scope="' + options.type + '"]');
		
		for (var i = 0; i < checks.length; i++) {
			if (options.exclude) {
				checks[i].classList.add('hidden');
			}
			else {
				checks[i].classList.remove('hidden');
			}
		}
		
		//  check set audio+video SC
		if (options.type=='audio' || options.type=='video') {
			var av = (document.querySelector('#exclusions input[value="audio"]').checked || document.querySelector('#exclusions input[value="video"]').checked) ? false : true;
			for (var i = 0; i < _SC_TYPE.av.length; i++) {
				// don't flip the status unless av is true or the status is currently 'na' (avoids overriding legit status when loading a saved evaluation)
				var sc_status = document.querySelector('input[name="' + _SC_TYPE.av[i] + '"]:checked').value;
				if (av || sc_status == 'unverified') {
					document.querySelector('input[name="' + _SC_TYPE.av[i] + '"][value="' + (av ? 'unverified' : 'na') + '"]').click();
				}
			}
		}
		
		// hide/show all individual SC for the checked content type
		for (var i = 0; i < _SC_TYPE[options.type].length; i++) {
			var status = options.exclude ? 'na' : 'unverified';
			document.getElementById(_SC_TYPE[options.type][i] + '-' + status).checked = true;
			setSuccessCriteriaStatus({name: _SC_TYPE[options.type][i], value: status});
		}
	}
	
	
	/* sets the appropriate status for the publication based on the how the success criteria have been evaluated */
	function setEvaluationResult() {
	
		var show_aa = smartWCAG.WCAGClassList().indexOf('|aa|') > 0 ? true  : false;
		
		var status_label = document.getElementById('conformance-result-status');
		var status_input = document.getElementById('conformance-result');
		
		var wcag_version = smartWCAG.WCAGVersion();
		var epub_a11y = document.getElementById('epub-a11y').value;
		
		// make sure there aren't any unverified success criteria
		
		var a_unverified_selector = getSCStatusSelector({status: 'unverified', level: 'all', includeEPUB: true});
		var aa_unverified_selector = getSCStatusSelector({status: 'unverified', level: 'all', includeEPUB: false});
		
		var incomplete = document.querySelectorAll(a_unverified_selector);
		
		var onix_a = document.getElementById('onix02');
		var onix_aa = document.getElementById('onix03');
		
		var a_fail_selector = getSCStatusSelector({status: 'fail', level: 'a', includeEPUB: true});
		var aa_fail_selector = getSCStatusSelector({status: 'fail', level: 'aa', includeEPUB: false});
		
		var level_a_fail = document.querySelectorAll(a_fail_selector);

		var epub_fail = document.querySelectorAll('input#epub-discovery-fail:checked');
		
		var level_a_pass = (level_a_fail.length == 0 && epub_fail.length == 0) ? true : false; 

		var wcag_ver = 'wcag' + wcag_version.replace('.','');
		var epub_ver = 'epub' + epub_a11y.replace('.','');
		
		// prep spec version being tested
		var spec_version = smart_ui.conformance.status[epub_ver][smart_lang];
			spec_version += ' - ';
			spec_version += smart_ui.conformance.status[wcag_ver][smart_lang];
			spec_version += ' ';
		
		// bail out if not all criteria have been evaluated
		if (incomplete.length > 0) {
			status_label.textContent = smart_ui.conformance.status.incomplete[smart_lang] + ': ' + spec_version + smart_ui.conformance.status[smartWCAG.WCAGLevel()][smart_lang];
			status_input.value = 'incomplete';
			return;
		}
		
		// checks that there aren't any failures if AA is specified
		// or if showing optional AA success criteria and all have been checked
		if (smartWCAG.WCAGLevel() == 'aa' || (show_aa && document.querySelectorAll(aa_unverified_selector).length == 0)) {
			
			if (level_a_pass && document.querySelectorAll(aa_fail_selector).length == 0) {
				
				status_label.textContent = smart_ui.conformance.status.pass[smart_lang] + ': ' + spec_version + smart_ui.conformance.status.aa[smart_lang];
				
				status_input.value = 'aa';
				
				if (!onix_aa.checked) { onix_aa.click(); }
				if (onix_a.checked) { onix_a.click(); }
				return;
			}
		}
		
		// otherwise not having an else if here allows verification to fall through to A, even if testing AA
		if (level_a_pass) {
			
			status_label.textContent = smart_ui.conformance.status.pass[smart_lang] + ': ' + spec_version + smart_ui.conformance.status.a[smart_lang];
			
			status_input.value = 'a';
			
			if (onix_aa.checked) { onix_aa.click(); }
			if (!onix_a.checked) { onix_a.click(); }
		}
		
		else {
			status_label.textContent = smart_ui.conformance.status.fail[smart_lang] + ': ' + spec_version + smart_ui.conformance.status[smartWCAG.WCAGLevel()][smart_lang];
			status_input.value = 'fail';
			if (onix_aa.checked) { onix_aa.click(); }
			if (onix_a.checked) { onix_a.click(); }
		}
	}
	
	
	
	function getSCStatusSelector(options) {
		
		/* 
		 * options requires three properties:
		 *
		 * - options.status = one of pass/fail/unverified/na
		 * - options.level = a or aa (wcag level) 
		 * - options.includeEPUB = true/false (whether to include the EPUB SC)
		 * 
		 */
		
		var selector = '';
		
		var wcag_versions = document.getElementById('wcag-version');
		
		for (var i = 0; i < wcag_versions.length; i++) {
		
			var wcag_num = wcag_versions.options[i].value.replace('.','');
			
			if (options.level == 'all' || options.level == 'a') {
				selector += 'section.w' + wcag_num + '.a input[value="' + options.status + '"]:checked, ';
			}
			
			if (smartWCAG.WCAGLevel() != 'a' && (options.level == 'all' || options.level == 'aa')) {
				selector += 'section.w' + wcag_num + '.aa input[value="' + options.status + '"]:checked, ';
			}
			
			if (wcag_versions.options[i].value == smartWCAG.WCAGVersion()) {
				break;
			}
		}
		
		if (options.includeEPUB) {
			selector += 'section.epub.norm input[value="unverified"]:checked';
		}
		
		return selector.replace(/, $/,'');
	}
	
	
	
	function setSuccessCriteriaStatus(options) {
		var sc_parent_section = document.getElementById(options.name); 
		
		/* reset the background */
		sc_parent_section.classList.remove(smartFormat.BG.PASS,smartFormat.BG.FAIL,smartFormat.BG.NA,smartFormat.BG.OBSOLETE);
		
		/* set background to new status */
		if (options.value != 'unverified') {
			sc_parent_section.classList.add(smartFormat.BG[options.value.toUpperCase()]);
		}
		
		/* show/hide the failure message field - not present for obsolete SC */
		var failure_message = document.getElementById(options.name + '-failnote');
		
		if (failure_message) {
			if (options.value == 'fail') {
				failure_message.classList.add('visible');
			}
			else {
				failure_message.classList.remove('visible');
			}
		}
		
		setEvaluationResult();
		setSCStats();
	}
	
	
	function setSCStats() {
		
		var sc = document.querySelectorAll('section#conformance section.visible div.reporting input.sc_status:checked');
		
		var pass = 0;
		var fail = 0;
		var na = 0;
		var unverified = 0;
		var obsolete = 0;
		
		for (var i = 0; i < sc.length; i++) {
			switch (sc[i].value) {
				case 'pass':
					pass += 1;
					break;
				
				case 'fail':
					fail += 1;
					break;
				
				case 'na':
					na += 1;
					break;
				
				case 'unverified':
					unverified += 1;
					break;
				
				case 'obsolete':
					obsolete += 1;
					break;
			}
		}
		
		document.getElementById('passCount').innerHTML = pass;
		document.getElementById('failCount').innerHTML = fail;
		document.getElementById('naCount').innerHTML = na;
		document.getElementById('unverifiedCount').innerHTML = unverified;
		document.getElementById('obsCount').innerHTML = obsolete;
	}
	
	
	return {
		setEvaluationResult: function() {
			setEvaluationResult();
		},
		
		setEPUBA11yVersion: function(version) {
			setEPUBA11yVersion(version);
		},
		
		setWCAGVersion: function(version,alert) {
			setWCAGVersion(version,alert);
		},
		
		setWCAGConformanceLevel: function(level) {
			setWCAGConformanceLevel(level);
		},
		
		displaySuccessCriteria: function() {
			displaySuccessCriteria();
		},
		
		configureContentTypeTests: function(options) {
			options = typeof(options) === 'object' ? options : {};
			if (!options.hasOwnProperty('type')) {
				return;
			}
			options.exclude = options.hasOwnProperty('exclude') ? options.exclude : false; 
			configureContentTypeTests(options);
		},
		
		setGlobalSCStatus: function(status,quiet) {
			if (!quiet) {
				if (!confirm(smart_ui.conformance.changeSC[smart_lang])) {
					return;
				}
			}
			
			var success_criteria = document.querySelectorAll('.a, .aa, .aaa, .epub');
			
			for (var i = 0; i < success_criteria.length; i++) {
				if (!success_criteria[i].classList.contains('hidden')) {
					document.querySelector('input[name="' + success_criteria[i].id + '"][value="' + status + '"]').click();
				}
			}
		},
		
		setSCStatus: function(options) {
			if (typeof(options) !== 'object' || !options.hasOwnProperty('name')) {
				return;
			}
			setSuccessCriteriaStatus(options);
		},
		
		showSCNoteField: function(sc_status_radio) {
		    var note = document.getElementById(sc_status_radio.name.replace('box',''));
		    
		    if (sc_status_radio.checked) {
				note.classList.add('visible');
		    }
		    else {
			    note.classList.remove('visible');
		    }
		},
		
		filterSCByStatus: function(radio) {
			var status_inputs = document.querySelectorAll('input.sc_status[value="' + radio.value + '"]:checked');
			for (var i = 0; i < status_inputs.length; i++) {
				var id = status_inputs[i].name;
				var status_parent_section = document.getElementById(id);
				if (radio.checked) {
					status_parent_section.classList.add('hidden');
				}
				else {
					var wcag_level = status_parent_section.className.match(/\b(a+)\b/);
					if (wcag_level === null || smartWCAG.WCAGClassList().indexOf('|'+wcag_level[0]+'|') !== -1) {
						status_parent_section.classList.remove('hidden');
					}
				}
			}
		},
		
		showSCBody: function(display) {
			var success_criteria = document.querySelectorAll('.sc-body');
			for (var i = 0; i < success_criteria.length; i++) {
				if (display) {
					success_criteria[i].classList.remove('hidden');
				}
				else {
					success_criteria[i].classList.add('hidden');
				}
			}
			if (display) {
				alert(smart_ui.conformance.toggleDesc.visible[smart_lang]);
			}
			else {
				alert(smart_ui.conformance.toggleDesc.hidden[smart_lang]);
			}
		},
		
		getSCStatusSelector: function(options) {
			return getSCStatusSelector(options);
		},
		
		showOptions: function() {
			if (options_dialog) {
				options_dialog.dialog('open');
			}
		}
	}

})();
