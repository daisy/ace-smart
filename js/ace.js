
'use strict';

/* 
 * 
 * smartAce
 * 
 * Loads an Ace report into the reporting tool.
 * 
 * Public functions:
 * 
 * - storeReportJSON - stores the ace json output to _aceReport
 * 
 * - loadReport - populates the ace data into the tool
 * 
 * 
 */

var smartAce = (function() {

	/* the default epub/wcag version + level to use for new evaluations */
	var _EPUB_DEFAULT_VERSION = '1.1';
	var _WCAG_DEFAULT_VERSION = '2.1';
	var _WCAG_DEFAULT_LEVEL = 'aa';
	
	/* holds the ace report json */
	var _aceReport = '';
	
	/* holds status messages to report to the user after loading */
	var _loadMessages = {
			inferred: '',
			reporting: '',
			features: [],
			obs: {
				features: []
			}
	};
	
	/* used to process incoming a11y metadata case-insensitively */
	var _SCHEMA_MAP = {
		accessibilityFeature: {
			alternativetext: 'alternativeText',
			annotations: 'annotations',
			aria: 'ARIA',
			audiodescription: 'audioDescription',
			bookmarks: 'bookmarks',
			braille: 'braille',
			captions: 'captions',
			chemml: 'ChemML',
			closedcaptions: 'closedCaptions',
			describedmath: 'describedMath',
			displaytransformability: 'displayTransformability',
			highcontrastaudio: 'highContrastAudio',
			highcontrastdisplay: 'highContrastDisplay',
			index: 'index',
			largeprint: 'largePrint',
			latex: 'latex',
			longdescription: 'longDescription',
			mathml: 'MathML',
			none: 'none',
			opencaptions: 'openCaptions',
			pagebreakmarkers: 'pageBreakMarkers',
			pagenavigation: 'pageNavigation',
			printpagenumbers: 'printPageNumbers',
			readingorder: 'readingOrder',
			rubyannotations: 'rubyAnnotations',
			signlanguage: 'signLanguage',
			structuralnavigation: 'structuralNavigation',
			synchronizedaudiotext: 'synchronizedAudioText',
			tableofcontents: 'tableOfContents',
			tactilegraphic: 'tactileGraphic',
			tactileobject: 'tactileObject',
			timingcontrol: 'timingControl',
			transcript: 'transcript',
			ttsMarkup: 'ttsmarkup',
			unknown: 'unknown'
		}
	};
	
	
	/* 
	 * loadAceReport processes the incoming Ace JSON report
	 * and configures/populates the evaluation
	 */
	
	function loadAceReport() {
	
		if (!_aceReport) {
			alert(smart_errors.ace.noData[smart_lang]);
			return;
		}
		
		/* extract and set the conformance level if the publication already contains conformsTo metadata */
		setWCAGConformance();
		
		/* iterate over the report metadata and set fields */
		loadMetadata();
		
		/* attempt to infer SC and discovery metadata from the data */
		inferAccessibilityMetadata();
		
		/* disable SC for any inapplicable content types */
		configureReporting();
		
		/* load extension data */
		if (Object.keys(smart_extensions).length > 0) {
			for (var key in smart_extensions) {
				smart_extensions[key].loadData(_aceReport);
			}
		}
		
		/* display information about the load to the user */
		showReportLoadResult();
	
	}
	
	
	/* 
	 * check the ace metadata for a dcterms:conformsTo property and set
	 * the WCAG level if it matches the epub accessibility conformance URL
	 */
	
	function setWCAGConformance() {
		
		var conformance_url = '';
		
		if (_aceReport['earl:testSubject'].hasOwnProperty('links') && _aceReport['earl:testSubject'].links.hasOwnProperty('dcterms:conformsTo')) {
			conformance_url = _aceReport['earl:testSubject'].links['dcterms:conformsTo'];
		}
		
		else if (_aceReport['earl:testSubject'].metadata.hasOwnProperty('dcterms:conformsTo')) {
			conformance_url = _aceReport['earl:testSubject'].metadata['dcterms:conformsTo'];
		}
		
		
		var epub_version = _EPUB_DEFAULT_VERSION;
		var wcag_version = _WCAG_DEFAULT_VERSION;
		var wcag_level = _WCAG_DEFAULT_LEVEL;
		
		if (conformance_url) {
			
			conformance_url = Array.isArray(conformance_url) ? conformance_url : [conformance_url];
			
			for (var i = 0; i < conformance_url.length; i++) {
				
				var conf_url = conformance_url[i].trim();
				
				var re = new RegExp('^((http://www\.idpf\.org/epub/a11y/accessibility-(?<epub10>20170105)\.html#wcag-(?<wcag20>[a]+))|(EPUB\s+Accessibility\s+(?<epubx>1.[1-9])\s+-\s+WCAG\s+(?<wcagx>2.[0-9])\s+Level\s+(?<wcaglvlx>[A]+)))');
				var is_match = conf_url.match(re);
				var setSC = false;
				
				if (is_match) {
					
					if (confirm(smart_ui.ace.load.hasConformsTo[smart_lang].replace('%%conformance_url%%', conf_url))) {
					
						setSC = true;
						
						if (is_match.groups.epub10) {
							epub_version = '1.0';
							wcag_version = '2.0';
							wcag_level = is_match.groups.wcag20;
						}
						
						else {
							epub_version = is_match.groups.epubx.replace(/^(\d)/,'$1.');
							wcag_version = is_match.groups.wcagx.replace(/^(\d)/,'$1.');
							wcag_level = is_match.groups.wcaglvlx.toLowerCase();
						}
						
						break;
					}
				}
			}
		}
		
		document.getElementById('epub-a11y').value = epub_version;
		smartConformance.setEPUBA11yVersion(epub_version);
		
		document.getElementById('wcag-version').value = wcag_version;
		smartConformance.setWCAGVersion(wcag_version,false);
		
		document.getElementById('wcag-level').value = wcag_level;
		smartConformance.setWCAGConformanceLevel(wcag_level);
		
		if (setSC) {
			smartConformance.setGlobalSCStatus('pass',true);
		}
	}
	
	
	/* 
	 * iterates over the metadata extracted from the package document and updates the pub info tab
	 */
	
	function loadMetadata() {
	
		// set DC metadata
		var dc_elements = ['title', 'identifier', 'creator', 'publisher', 'date', 'description', 'subject'];
		
		for (var i = 0; i < dc_elements.length; i++) {
			document.getElementById(dc_elements[i]).value = formatMetadataProperty(dc_elements[i],'dc:'+dc_elements[i]);	
		}
		
		// set DCTERMS metadata
		if (_aceReport['earl:testSubject']['metadata'].hasOwnProperty('dcterms:modified')) {
			document.getElementById('modified').value = smartFormat.convertUTCDateToString(_aceReport['earl:testSubject']['metadata']['dcterms:modified']);
		}	
		
		// set discovery metadata
		
		var discovery_checkbox_properties = ['accessibilityFeature', 'accessMode', 'accessibilityHazard'];
		
		for (var i = 0; i < discovery_checkbox_properties.length; i++) {
			setDiscoveryCheckboxes(discovery_checkbox_properties[i], 'schema:'+discovery_checkbox_properties[i]);	
		}
		
		setSufficientSets();
		
		var summary = formatMetadataProperty('accessibilitySummary','schema:accessibilitySummary');
		
		// writing each textarea separately as no reliable event to capture the js value change
		document.getElementById('accessibilitySummary').value = summary; 
		document.getElementById('onix00').value = summary; 
		
		// set evaluator metadata
		
		document.getElementById('certifiedBy').value = formatMetadataProperty('certifiedBy', 'a11y:certifiedBy');
		
		// evaluator links that could be in meta or link elements
		var evaluator_links = ['certifierReport'];
		
		for (var i = 0; i < evaluator_links.length; i++) {
		
			var evaluator_value = '';
			
			if (_aceReport['earl:testSubject'].hasOwnProperty('links') &&_aceReport['earl:testSubject'].links.hasOwnProperty('a11y:'+evaluator_links[i])) {
				evaluator_value = _aceReport['earl:testSubject'].links['a11y:'+evaluator_links[i]];
			}
			
			else if (_aceReport['earl:testSubject'].metadata.hasOwnProperty('a11y:'+evaluator_links[i])) {
				evaluator_value = _aceReport['earl:testSubject'].metadata['a11y:'+evaluator_links[i]];
			}
			
			else {
				continue;
			}

			document.getElementById(evaluator_links[i]).value = evaluator_value;	
		}
	}
	
	
	/* 
	 * processes each metadata property to return the appropriate string value
	 */
	
	function formatMetadataProperty(id, property) {
	
		if (!_aceReport['earl:testSubject']['metadata'].hasOwnProperty(property)) {
			return '';
		}
		
		var report_property = _aceReport['earl:testSubject']['metadata'][property];
		
		var formatted_value = '';
		
		// for these properties, only the first instance found is used when there are multiple available
		var select_first_instance = {"dc:title": true, "dc:identifier": true};
		
		/* 
		 * if the specified property contains an array of values, selects either
		 * the first value (for those defined above) or concatenates the values
		 * together into a comma-separated list
		 * 
		 * for single values, identifiers are processed differently to format URNs
		 */
		
		if (Array.isArray(report_property)) {
			
			if (select_first_instance.hasOwnProperty(property)) {
				
				if (id == 'dc:identifier') {
					formatted_value = smartFormat.formatIdentifier(report_property[0]);
				}
				
				else {
					formatted_value = report_property[0];
				}
			}
			
			else {
				for (var i = 0; i < report_property.length; i++) {
					formatted_value += (i > 0) ? ', ' : '';
					formatted_value += report_property[i];
				}
			}
		}
		
		else {
			if (property == 'dc:identifier') {
				formatted_value = smartFormat.formatIdentifier(report_property);
			}
			else {
				formatted_value = report_property;
			}
		}
		
		return formatted_value;
	}
	
	
	/* 
	 * runs through any accessibility metadata extracted from the publication
	 * and checks off or fills in the appropriate field in the discovery
	 * metadata tab  
	 */
	
	function setDiscoveryCheckboxes(id, property) {
		
		if (!_aceReport['earl:testSubject']['metadata'].hasOwnProperty(property)) {
			return;
		}
		
		var report_property = Array.isArray(_aceReport['earl:testSubject']['metadata'][property]) ? 
				_aceReport['earl:testSubject']['metadata'][property] :
				[ _aceReport['earl:testSubject']['metadata'][property] ];
		
		
		for (var i = 0; i < report_property.length; i++) {
			
			var value = (_SCHEMA_MAP.hasOwnProperty(id) && _SCHEMA_MAP[id].hasOwnProperty(report_property[i])) ? _SCHEMA_MAP[id][report_property[i].toLowerCase()] : report_property[i];
			
			// remap old features
			
			switch (value) {
				case 'captions':
					value = 'closedCaptions';
					_loadMessages.obs.features.push(report_property[i] + ' (closedCaptions)');
					break;
				
				case 'printPageNumbers':
					value = 'pageBreakMarkers';
					_loadMessages.obs.features.push(report_property[i] + ' (pageBreakMarkers)');
					break;
			}
			
			var checkbox = document.querySelector('#' + id + ' input[value="' + value + '"]');
			
			if (id == 'accessibilityFeature' && checkbox === null) {
				smartDiscovery.addCustomFeature(report_property[i]);
				checkbox = document.querySelector('#' + id + ' input[value="' + report_property[i] + '"]');
				_loadMessages.features.push(report_property[i]);
			}
			
			if (checkbox === null) {
				console.log('Failed to load ace metadata string: #' + id + ' input[value="' + report_property[i] + '"]');
				continue;
			}
			
			if (!checkbox.checked) {
				checkbox.click();
			}
		}
	}
	
	
	/* 
	 * because sufficient access modes are a list of 1..n access modes
	 * these have to be separately processed from the rest of the metadata
	 * by splitting/looping over the values in each set
	 */
	
	function setSufficientSets() {
		
		if (!_aceReport['earl:testSubject']['metadata'].hasOwnProperty('schema:accessModeSufficient')) {
			return;
		}
		
		// if there is only one set, pushes it into an array so that the following loop never fails
		var report_sets = Array.isArray(_aceReport['earl:testSubject']['metadata']['schema:accessModeSufficient']) ?
						_aceReport['earl:testSubject']['metadata']['schema:accessModeSufficient'] :
						[ _aceReport['earl:testSubject']['metadata']['schema:accessModeSufficient'] ];
	
		for (var i = 0; i < report_sets.length; i++) {
		
			var access_modes = report_sets[i].split(/[\s,]+/);
			
			for (var j = 0; j < access_modes.length; j++) {
				document.querySelector('#set' + (i+1) + ' input[value="' + access_modes[j] + '"]').click();
			}
			
			/* add an additional set so the user always has one blank one left to work with */
			if (i > 0) {
				smartDiscovery.addNewSufficientSet();
			}
		}
	}
	
	
	/* 
	 * attempts to infer accessibility features from the metadata
	 */
	
	function inferAccessibilityMetadata() {
	
		/* 
		 * Note that ONIX fields are automatically synched to discovery fields
		 * and vice-versa.
		 * DO NOT set ONIX fields that have an equivalent discovery field or
		 * the result will be that both the discovery and distribution fields
		 * will be rendered unchecked.
		 */
		
		if (_aceReport['a11y-metadata']['present'].length > 0) {
			// if publication contains metadata, don't suggest more
			return '';
		}
		
		else {
			// check if the evaluator wants the metadata inferred
			if (!confirm(smart_ui.ace.load.inferMetadata[smart_lang])) {
				return '';
			}
		}
		
		var user_message = document.createElement('ul');
		
		// parse out a11y metadata values to set based on the report info
		
		var hasAltText = false;
		
		if (_aceReport['data'].hasOwnProperty('images')) {
			for (var i = 0; i < _aceReport['data']['images'].length; i++) {
				if (_aceReport['data']['images'][i].hasOwnProperty('alt') && _aceReport['data']['images'][i]['alt'] != '') {
					hasAltText = true;
					user_message.appendChild(setCheckbox('accessibilityFeature','alternativeText'));
					break;
				}
			}
		}
		
		if (_aceReport['properties']['hasMathML']) {
			user_message.appendChild(setCheckbox('accessibilityFeature','MathML'));
		}
		
		if (_aceReport['properties']['hasPageBreaks']) {
			user_message.appendChild(setCheckbox('accessibilityFeature','pageBreakMarkers'));
		}
		
		/* can typically be assumed that every epub has a reading order */
		user_message.appendChild(setCheckbox('accessibilityFeature','readingOrder'));
		
		/* can typically be assumed that every epub has a table of contents */
		user_message.appendChild(setCheckbox('accessibilityFeature','tableOfContents'));
		
		// assuming any publication being assessed in not purely image-based
		user_message.appendChild(setCheckbox('accessMode','textual'));
		setSufficientMode(1,'textual');
		
		// track modes to set sufficient label later
		var sufficient = 'textual';
		
		if (hasAltText || _aceReport.hasOwnProperty('videos')) {
			user_message.appendChild(setCheckbox('accessMode','visual'));
			setSufficientMode(1,'visual');
			sufficient += ', visual';
		}
		
		if (_aceReport['data'].hasOwnProperty('audios')) {
			user_message.appendChild(setCheckbox('accessMode','auditory'));
			setSufficientMode(1,'auditory');
			sufficient += ', auditory';
		}
		
		var sufficient_message = document.createElement('li');
			sufficient_message.appendChild(document.createTextNode('accessModeSufficient: '+sufficient));
		user_message.appendChild(sufficient_message);
		
		/* check if media overlays are present */
		if (_aceReport['earl:testSubject']['metadata'].hasOwnProperty('media:duration')) {
			user_message.appendChild(setCheckbox('accessibilityFeature','synchronizedAudioText'));
		}
		
		_loadMessages.inferred = user_message.hasChildNodes() ? user_message : '';
	
	}
	
	
	/* generic function that just clicks whatever checkbox is passed in */
	function setCheckbox(property, meta_id) {
		document.querySelector('input[type="checkbox"][value="' + meta_id + '"]').click();
		var li = document.createElement('li');
			li.appendChild(document.createTextNode(property + ': ' + meta_id));
		return li;
	}
	
	
	/* check of a mode within an accessModeSufficient fieldset */
	function setSufficientMode(set_id, meta_id) {
		document.querySelector('fieldset#set' + set_id + ' input[type="checkbox"][value="' + meta_id + '"]').click();
	}
	
	
	/* 
	 * disables categories of success criteria depending on what they test for
	 * and whether that content is present in the epub
	 */
	function configureReporting() {
		
		if (!_aceReport.hasOwnProperty('data')) {
			return;
		}
		
		var alert_list = document.createElement('ul');
		
		setSuccessCriteriaStatus();
		
		var content_types = {
								img: {property: 'images', description: smart_ui.ace.contentType.images[smart_lang]},
								script: {property: 'scripts', description: smart_ui.ace.contentType.scripting[smart_lang]},
								audio: {property: 'audios', description: smart_ui.ace.contentType.audio[smart_lang]},
								video: {property: 'videos', description: smart_ui.ace.contentType.video[smart_lang]}
							};
		
		for (var id in content_types) {
			if (excludeContentChecks(id, content_types[id].property)) {
				var li = document.createElement('li');
					li.appendChild(document.createTextNode(content_types[id].description))
				alert_list.appendChild(li);
			}
		}
		
		if (!_aceReport['properties']['hasPageBreaks']) {
			document.querySelector('input[name="epub-pagebreaks"][value="na"]').click();
			document.querySelector('input[name="epub-pagelist"][value="na"]').click();
			document.querySelector('input[name="epub-pagesrc"][value="na"]').click();
			var li = document.createElement('li');
				li.appendChild(document.createTextNode(smart_ui.ace.contentType.pagebreaks[smart_lang]))
			alert_list.appendChild(li);
		}
		
		if (!_aceReport['earl:testSubject']['metadata'].hasOwnProperty('media:duration')) {
			document.querySelector('input[name="epub-mo-esc"][value="na"]').click();
			document.querySelector('input[name="epub-mo-nav"][value="na"]').click();
			document.querySelector('input[name="epub-mo-readorder"][value="na"]').click();
			document.querySelector('input[name="epub-mo-skip"][value="na"]').click();
			var li = document.createElement('li');
				li.appendChild(document.createTextNode(smart_ui.ace.contentType.overlays[smart_lang]))
			alert_list.appendChild(li);
		}
		
		setEPUBFeatureWarnings();
		
		_loadMessages.reporting = alert_list.hasChildNodes() ? alert_list : '';
	}
	
	
	// analyzes the assertions in the ace report and sets the correspoding success criteria status
	function setSuccessCriteriaStatus() {
		
		if (_aceReport['earl:result']['earl:outcome'] == 'pass') {
			setSCStatus('sc-3.1.1','pass'); // lang
		}
		
		else {
			if (!_aceReport.hasOwnProperty('assertions')) {
				// problem with ace?
				console.log('Report did not pass but contains no failure assertions.');
				return;
			}
			
			var assert = compileAssertions();
			
			var noWarn = true; // does nothing but avoid warnings of suspicious code when minifying
			
			// current to axe ruleset 4.8.2
			// excludes experimental rules and best practices
			
			if (assert['area-alt']) { setSCStatus('sc-1.1.1', 'fail', assert['area-alt']); }
			if (assert['aria-allowed-attr']) { setSCStatus('sc-4.1.2', 'fail', assert['aria-allowed-attr']); }
			if (assert['aria-braille-equivalent']) { setSCStatus('sc-4.1.2', 'fail', assert['aria-allowed-attr']); }
			if (assert['aria-command-name']) { setSCStatus('sc-4.1.2', 'fail', assert['aria-command-name']); }
			if (assert['aria-conditional-attr']) { setSCStatus('sc-4.1.2', 'fail', assert['aria-command-name']); }
			if (assert['aria-deprecated-role']) { setSCStatus('sc-4.1.2', 'fail', assert['aria-command-name']); }
			if (assert['aria-hidden-body']) { setSCStatus('sc-4.1.2', 'fail', assert['aria-hidden-body']); }
			if (assert['aria-hidden-focus']) { setSCStatus('sc-4.1.2', 'fail', assert['aria-hidden-focus']); }
			if (assert['aria-input-field-name']) { setSCStatus('sc-4.1.2', 'fail', assert['aria-input-field-name']); }
			if (assert['aria-meter-name']) { setSCStatus('sc-1.1.1', 'fail', assert['aria-meter-name']); }
			if (assert['aria-progressbar-name']) { setSCStatus('sc-1.1.1', 'fail', assert['aria-progressbar-name']); }
			if (assert['aria-prohibited-attr']) { setSCStatus('sc-4.1.2', 'fail', assert['aria-required-attr']); }
			if (assert['aria-required-attr']) { setSCStatus('sc-4.1.2', 'fail', assert['aria-required-attr']); }
			if (assert['aria-required-children']) { setSCStatus('sc-1.3.1', 'fail', assert['aria-required-children']); }
			if (assert['aria-required-parent']) { setSCStatus('sc-1.3.1', 'fail', assert['aria-required-parent']); }
			if (assert['aria-roles']) { setSCStatus('sc-1.3.1', 'fail', assert['aria-roles']); setSCStatus('sc-4.1.2', 'fail', assert['aria-roles']); }
			if (assert['aria-toggle-field-name']) { setSCStatus('sc-4.1.2', 'fail', assert['aria-toggle-field-name']); }
			if (assert['aria-tooltip-name']) { setSCStatus('sc-4.1.2', 'fail', assert['aria-tooltip-name']); }
			if (assert['aria-valid-attr']) { setSCStatus('sc-4.1.2', 'fail', assert['aria-valid-attr']); }
			if (assert['aria-valid-attr-value']) { setSCStatus('sc-1.3.1', 'fail', assert['aria-valid-attr-value']); setSCStatus('sc-4.1.2', 'fail', assert['aria-valid-attr-value']); }
			if (assert['autocomplete-valid']) { setSCStatus('sc-1.3.5', 'fail', assert['autocomplete-valid']); }
			if (assert['avoid-inline-spacing']) { setSCStatus('sc-1.4.12', 'fail', assert['avoid-inline-spacing']); }
			if (assert['blink']) { setSCStatus('sc-2.2.2', 'fail', assert['blink']); }
			if (assert['button-name']) { setSCStatus('sc-4.1.2', 'fail', assert['button-name']); }
			if (assert['bypass']) { setSCStatus('sc-2.4.1', 'fail', assert['bypass']); }
			if (assert['color-contrast']) { setSCStatus('sc-1.4.3', 'fail', assert['color-contrast']); }
			if (assert['color-contrast-enhanced']) { setSCStatus('sc-1.4.6', 'fail', assert['color-contrast-enhanced']); }
			if (assert['definition-list']) { setSCStatus('sc-1.3.1', 'fail', assert['definition-list']); }
			if (assert['dlitem']) { setSCStatus('sc-1.3.1', 'fail', assert['dlitem']); }
			if (assert['document-title']) { setSCStatus('sc-2.4.2', 'fail', assert['document-title']); }
			if (assert['duplicate-id-aria']) { setSCStatus('sc-4.1.2', 'fail', assert['duplicate-id-aria']); }
			if (assert['form-field-multiple-labels']) { setSCStatus('sc-3.3.2', 'fail', assert['form-field-multiple-labels']); }
			if (assert['frame-focusable-content']) { setSCStatus('sc-2.1.1', 'fail', assert['frame-focusable-content']); }
			if (assert['frame-title']) { setSCStatus('sc-4.1.2', 'fail', assert['frame-title']); }
			if (assert['frame-title-unique']) { setSCStatus('sc-4.1.2', 'fail', assert['frame-title-unique']); }

			if (!assert['html-has-lang'] && !assert['html-lang-valid'] && !assert['html-xml-lang-mismatch']) {
				setSCStatus('sc-3.1.1', 'pass', '');
			}
			else {
				if (assert['html-has-lang']) { setSCStatus('sc-3.1.1', 'fail', assert['html-has-lang']); }
				if (assert['html-lang-valid']) { setSCStatus('sc-3.1.1', 'fail', assert['html-lang-valid']); }
				if (assert['html-xml-lang-mismatch']) { setSCStatus('sc-3.1.1', 'fail', assert['html-xml-lang-mismatch']); }
			}
			
			if (assert['identical-links-same-purpose']) { setSCStatus('sc-2.4.9', 'fail', assert['identical-links-same-purpose']); }
			if (assert['image-alt']) { setSCStatus('sc-1.1.1', 'fail', assert['image-alt']); }
			if (assert['input-button-name']) { setSCStatus('sc-4.1.2', 'fail', assert['input-button-name']); }
			if (assert['input-image-alt']) { setSCStatus('sc-1.1.1', 'fail', assert['input-image-alt']); }
			if (assert['label']) { setSCStatus('sc-1.3.1', 'fail'); setSCStatus('sc-3.3.2', 'fail', assert['label']); }
			if (assert['layout-table']) { setSCStatus('sc-1.3.1', 'fail', assert['layout-table']); }
			if (assert['link-in-text-block']) { setSCStatus('sc-1.4.1', 'fail', assert['link-in-text-block']); }
			if (assert['link-name']) { setSCStatus('sc-1.1.1', 'fail', assert['link-name']); setSCStatus('sc-2.4.4', 'fail', assert['link-name']); setSCStatus('sc-4.1.2', 'fail', assert['link-name']); }
			if (assert['list']) { setSCStatus('sc-1.3.1', 'fail', assert['list']); }
			if (assert['listitem']) { setSCStatus('sc-1.3.1', 'fail', assert['list-item']); }
			if (assert['marquee']) { setSCStatus('sc-2.2.2', 'fail', assert['marquee']); }
			if (assert['meta-refresh']) { setSCStatus('sc-2.2.1', 'fail', assert['meta-refresh']); }
			if (assert['meta-refresh-no-exceptions']) { setSCStatus('sc-2.2.4', 'fail', assert['meta-refresh-no-exceptions']); setSCStatus('sc-3.2.5', 'fail', assert['meta-refresh-no-exceptions']); }
			if (assert['meta-viewport']) { setSCStatus('sc-1.4.4', 'fail', assert['meta-viewport']); }
			if (assert['nested-interactive']) { setSCStatus('sc-4.1.2', 'fail', assert['nested-interactive']); }
			if (assert['no-autoplay-audio']) { setSCStatus('sc-1.4.2', 'fail', assert['no-autoplay-audio']); }
			if (assert['object-alt']) { setSCStatus('sc-1.1.1', 'fail', assert['object-alt']); }
			if (assert['role-image-alt']) { setSCStatus('sc-1.1.1', 'fail', assert['role-img-alt']); }
			if (assert['scrollable-region-focusable']) { setSCStatus('sc-2.1.1', 'fail', assert['scrollable-region-focusable']); }
			if (assert['select-name']) { setSCStatus('sc-4.1.2', 'fail', assert['select-name']); }
			if (assert['server-side-image-map']) { setSCStatus('sc-2.1.1', 'fail', assert['server-side-image-map']); }
			if (assert['svg-img-alt']) { setSCStatus('sc-1.1.1', 'fail', assert['svg-img-alt']); }
			if (assert['target-size']) { setSCStatus('sc-2.5.8', 'fail', assert['target-size']); }
			if (assert['td-headers-attr']) { setSCStatus('sc-1.3.1', 'fail', assert['td-headers-attr']); }
			if (assert['th-has-data-cells']) { setSCStatus('sc-1.3.1', 'fail', assert['td-has-data-cells']); }
			if (assert['valid-lang']) { setSCStatus('sc-3.1.2', 'fail', assert['valid-lang']); }
			if (assert['video-caption']) { setSCStatus('sc-1.2.2', 'fail', assert['video-caption']); setSCStatus('sc-1.2.3', 'fail', assert['video-caption']); }
			
			// check if the accessibility metadata is set
			
			var a11y_err = '';
			
			if (_aceReport['a11y-metadata'].missing.includes('schema:accessMode')) {
				a11y_err += smart_ui.ace.error.accessMode[smart_lang] + '\n';
			}
			
			if (_aceReport['a11y-metadata'].missing.includes('schema:accessibilityFeature')) {
				a11y_err += smart_ui.ace.error.accessibilityFeature[smart_lang] + '\n';
			}
			
			if (_aceReport['a11y-metadata'].missing.includes('schema:accessibilityHazard')) {
				a11y_err += smart_ui.ace.error.accessibilityHazard[smart_lang] + '\n';
			}
			
			if (a11y_err) {
				setSCStatus('epub-discovery', 'fail', a11y_err);
			}
		}
	}
	
	
	/* generic function to check the applicable status field within a success criterion */
	function setSCStatus(id, status, msg) {
		document.querySelector('input[name="'+id+'"][value="' + status + '"]').click();
		if (status == 'fail') {
			document.querySelector('textarea[id="'+id+'-err"]').value += msg + '\n';
		}
	}
	
	
	/*
	 * extracts all the ace assertions (failures) into a simpler to manage form
	 */
	function compileAssertions() {
		
		var ace_failures = {};
		
		for (var i = 0; i < _aceReport.assertions.length; i++) {
			
			if (!_aceReport.assertions[i].hasOwnProperty('assertions')) { 
				console.log('Document assertions has no sub-assertions');
				continue;
			}
			
			for (var j = 0; j < _aceReport.assertions[i].assertions.length; j++) {
				
				if (!_aceReport.assertions[i].assertions[j].hasOwnProperty('earl:test')) {
					console.log('Document assertions does not have an earl:test section');
					continue;
				}
				
				if (!_aceReport.assertions[i].assertions[j]['earl:test'].hasOwnProperty('dct:title')) {
					console.log('Assertion test has no title');
					continue;
				}
				
				if (!ace_failures.hasOwnProperty(_aceReport.assertions[i].assertions[j]['earl:test']['dct:title'])) {
					ace_failures[_aceReport.assertions[i].assertions[j]['earl:test']['dct:title']] = '';
				}
				
				// simplifies the ace structure so the assertion code is the key and a pared-down error message is the value
				ace_failures[_aceReport.assertions[i].assertions[j]['earl:test']['dct:title']] += _aceReport.assertions[i].assertions[j]['earl:result']['dct:description'].replace(/Fix (any|all) of the following:\s+/i,'') + ' (' + _aceReport.assertions[i]['earl:testSubject'].url + ').\n';
			}
		}
		
		return ace_failures;
	}
	
	
	/* 
	 * generic function that sets content checks (audio, video, images, etc.) to n/a if no matching content in the publication
	 */
	
	function excludeContentChecks(id, property) {
		
		// get the checkbox in the exclusions list for the specified id
		var test_checkbox = document.querySelector('#exclusions input[value="' + id + '"]');
		
		if (!_aceReport['data'].hasOwnProperty(property)) {
			if (!test_checkbox.checked) {
				// check to make the applicable success criteria n/a
				// clicking the checkbox calls smartConformance.changeContentConformance to modify the form
				test_checkbox.click();
			}
			return true;
		}
		
		else {
			if (test_checkbox.checked) {
				// uncheck to reset the success criteria to unverified
				test_checkbox.click();
			}
			return false;
		}
	}
	
	
	// appends the list of images and alt texts to the corresponding requirement in sc 1.1.1
	function setImageStatus(options) {
	
		var sc_111_listitem = document.getElementById(options.id);
		
		var leadin = document.createElement('p');
			leadin.appendChild(document.createTextNode(options.leadin));
		
		sc_111_listitem.appendChild(leadin);
		
		var image_list = document.createElement('ul');
		
		for (var i = 0; i < options.images.length; i++) {
			
			var image_item = document.createElement('li');
			
			var code = document.createElement('code');
				code.appendChild(document.createTextNode(options.images[i]));
			
			image_item.appendChild(code);
			image_list.appendChild(image_item);
		}
		
		sc_111_listitem.appendChild(image_list);
	}
	
	
	/* 
	 * inspects the ace report to see if any epub-specific features have been included in the publication
	 * and, if so, sets the warning in the conformance tab to alert the user to their presence
	 */
	function setEPUBFeatureWarnings() {
		
		// checks for: manifest fallbacks, bindings, epub:switch, and epub:trigger
		var features = {'manifest': 'hasManifestFallbacks', 'bindings': 'hasBindings', 'epub-switch': 'epub-switches', 'epub-trigger': 'epub-triggers'};
		var warningIsVisible = false;
		
		for (var key in features) {
			
			// if bindings or manifest fallbacks are present, they are set to true in the properties section - switches and triggers get listed under the data section
			if  ((_aceReport['properties'].hasOwnProperty(features[key]) && _aceReport['properties'][features[key]]) || _aceReport['data'].hasOwnProperty(features[key])) {
				
				var messages = document.getElementsByClassName(key);
				
				for (var i = 0; i < messages.length; i++) {
					messages[i].classList.add('listitem');
				}
				
				if (!warningIsVisible) {
					document.getElementById('fallbacks').classList.remove('hidden');
					document.getElementById('fallbacks').classList.add('visible');
					warningIsVisible = true;
				}
			}
		}
	}
	
	
	/* 
	 * generates the inforation to display in the pop-up dialog that appears 
	 * after the ace report import is finished
	 */
	function showReportLoadResult() {
		var import_result = document.getElementById('import');
		
		var successful_load = document.createElement('p');
			successful_load.appendChild(document.createTextNode(smart_ui.ace.load.success[smart_lang]));
		import_result.appendChild(successful_load);
		
		// alert user to any content checks that have been set to n/a
		
		if (_loadMessages.reporting.hasChildNodes()) {
			var report_exclusions = document.createElement('p');
				report_exclusions.appendChild(document.createTextNode(smart_ui.ace.load.disabled[smart_lang]));
			import_result.appendChild(report_exclusions);
			
			import_result.appendChild(_loadMessages.reporting);
			
			var exclusions_info = document.createElement('p');
				exclusions_info.appendChild(document.createTextNode(smart_ui.ace.load.reenable[smart_lang]));
			import_result.appendChild(exclusions_info);
		}
		
		// alert the user to any discovery metadata that was inferred from the ace report
		
		if (_loadMessages.inferred) {
			var inferred_metadata = document.createElement('p');
				inferred_metadata.appendChild(document.createTextNode(smart_ui.ace.load.a11yMetadata[smart_lang]));
			import_result.appendChild(inferred_metadata);
			
			import_result.appendChild(_loadMessages.inferred);
			
			var verify_inferred = document.createElement('p');
				verify_inferred.appendChild(document.createTextNode(smart_ui.ace.load.verifyMetadata[smart_lang]));
			import_result.appendChild(verify_inferred);
		}
		
		// alert the user if there are accessibility features that don't match any of the known/accepted values
		
		if (_loadMessages.features.length > 0) {
			var feature_metadata = document.createElement('p');
				feature_metadata.appendChild(document.createTextNode(smart_ui.ace.load.unknownFeatures[smart_lang]));
			import_result.appendChild(feature_metadata);
			
			var feature_ul = document.createElement('ul');
			
			_loadMessages.features.forEach(function(feature) {
				var feature_li = document.createElement('li');
					feature_li.appendChild(document.createTextNode(feature));
				feature_ul.appendChild(feature_li);
			});
			
			import_result.appendChild(feature_ul);
			
			var verify_features = document.createElement('p');
				verify_features.appendChild(document.createTextNode(smart_ui.ace.load.verifyFeatures[smart_lang]));
			import_result.appendChild(verify_features);
		}
		
		// alert the user if there are obsolete accessibility features
		
		if (_loadMessages.obs.features.length > 0) {
			var feature_metadata = document.createElement('p');
				feature_metadata.appendChild(document.createTextNode(smart_ui.ace.load.obsoleteFeatures[smart_lang]));
			import_result.appendChild(feature_metadata);
			
			var feature_ul = document.createElement('ul');
			
			_loadMessages.obs.features.forEach(function(feature) {
				var feature_li = document.createElement('li');
					feature_li.appendChild(document.createTextNode(feature));
				feature_ul.appendChild(feature_li);
			});
			
			import_result.appendChild(feature_ul);
		}
		
		import_dialog.dialog('open');
	}

	
	return {
		storeReportJSON: function(json) {
			_aceReport = json;
		},
		
		loadAceReport: function() {
			loadAceReport();
		}
	}

})();
