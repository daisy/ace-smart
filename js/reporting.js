
'use strict';

/* 
 * 
 * smartReport
 * 
 * Controls the report generation.
 * 
 * Public functions:
 * 
 * - validateConformanceReport - validates the evaluation for missed tests and invalid metadata
 * 							   - the function is now run automatically when generating a preview or final report 
 * 
 * - generateConformanceReport - creates the final report
 * 							   - the report is either viewable in report.php or downloaded from that page
 * 
 * - setNoteOutput 			   - sets _notesToDisplay - which kinds of notes the user wants included in the report
 * 
 */

var output_options_dialog;

var smartReport = (function() {
	
	var _notesToDisplay = 'all';
	var _smartExtensionTabs = new Array();
	var _generateExtension = {};
	
	
	/* iterates over the valdation functions for each tab to determine if there are any issues with the evaluation */
	
	function validateConformanceReport() {
		
		smartError.clearAll();
		
		var is_valid = true;
		
		is_valid = smartValidation.validatePublicationMetadata() ? is_valid : false;
		
		is_valid = smartValidation.validateSuccessCriteria() ? is_valid : false;
		
		is_valid = smartValidation.validateEvaluationMetadata() ? is_valid : false;
		
		is_valid = smartValidation.validateAccessibilityMetadata() ? is_valid : false;
		
		// validate user extensions
		if (Object.keys(smart_extensions).length > 0) {
			for (var key in smart_extensions) {
				is_valid = smart_extensions[key].validate() ? is_valid : false;
			}
		}
		
		return is_valid;
	}
	
	
	
	
	/* 
	 * Creates the html conformance report for the publication
	 */
	
	function generateConformanceReport(reportOutputType) {
		
		if (!validateConformanceReport()) {
			if (!confirm(smart_ui.reporting.confirm[smart_lang])) {
				return;
			}
		}
		
		var title = document.getElementById('title').value;
		
		/* get the HTML report markup */
		var report_body = createReportBody();
		
		var report_title = smart_ui.reporting.title[smart_lang].replace('%%val%%', title);
		
		var today = new Date();
		var timestamp= today.toLocaleString(smart_locale, { month: 'long' }) + ' ' + today.getDate() + ', ' + today.getFullYear();
			timestamp += ' \u{2012} '; 
			timestamp += today.getHours().pad(2) + ':' + today.getMinutes().pad(2) + ':' + today.getSeconds().pad(2);
		
		var report_timestamp = timestamp;
		
		var logo = document.createElement('span');
		
		var extension_list = '';
		
		/* include logos from extension organizations - currently not used */
		
		if (Object.keys(smart_extensions).length > 0) {
			for (var key in smart_extensions) {
				if (typeof smart_extensions[key].LOGO !== 'undefined' && smart_extensions[key].LOGO.length == 3) {
					var logoLink = document.createElement('a');
						logoLink.setAttribute('href', smart_extensions[key].LOGO[2]);
					
					var logoImg = document.createElement('img');
						logoImg.setAttribute('src', smart_extensions[key].LOGO[0]);
						logoImg.setAttribute('alt', smart_extensions[key].LOGO[1]);
					
					logoLink.appendChild(logoImg);
					logo.appendChild(logoLink);
				}
			}
			
			_smartExtensionTabs.forEach(function(tab) { extension_list += tab.id+','; });
			extension_list = extension_list.slice(0,-1)
		}
		
		// submit the html to report.php to present it to the user
		
		var report_form = document.createElement('form');
			report_form.target = '_blank';    
			report_form.method = 'POST';
			report_form.action = 'report.php';
		
		var report_title_input = document.createElement('input');
			report_title_input.type = 'hidden';
			report_title_input.name = 'title';
			report_title_input.value = report_title;
		report_form.appendChild(report_title_input);
		
		var report_logo_input = document.createElement('input');
			report_logo_input.type = 'hidden';
			report_logo_input.name = 'logo';
			report_logo_input.value = logo.innerHTML;
		report_form.appendChild(report_logo_input);
		
		var report_body_input = document.createElement('input');
			report_body_input.type = 'hidden';
			report_body_input.name = 'report';
			report_body_input.value = report_body;
		report_form.appendChild(report_body_input);
		
		var report_timestamp_input = document.createElement('input');
			report_timestamp_input.type = 'hidden';
			report_timestamp_input.name = 'timestamp';
			report_timestamp_input.value = report_timestamp;
		report_form.appendChild(report_timestamp_input);
		
		if (_smartExtensionTabs.length > 0) {
			var report_modules_input = document.createElement('input');
				report_modules_input.type = 'hidden';
				report_modules_input.name = 'modules';
				report_modules_input.value = extension_list;
			report_form.appendChild(report_modules_input);
		}
		
		if (reportOutputType == 'preview') {
			var report_flag_input = document.createElement('input');
				report_flag_input.type = 'hidden';
				report_flag_input.name = 'preview';
				report_flag_input.value = 1;
			report_form.appendChild(report_flag_input);
		}
		
		document.body.appendChild(report_form);
		report_form.submit();
		report_form.parentNode.removeChild(report_form);
	}
	
	
	/* generates the html that goes into the body of the final report */
	
	function createReportBody() {
		var reportBody = document.createElement('body');
		
		// add the header
		var header = document.createElement('div');
			header.id = 'report-header';
			header.appendChild(createReportHeader());
		
		// add the publication info below the title
		var publicationInfo = createReportPublicationInfo();
		
		header.appendChild(publicationInfo.content);
		
		reportBody.appendChild(header);
		
		// use wrapper element to group body content for scrolling
		var wrapper = document.createElement('div');
			wrapper.id = 'report-body';
		
		// add the tab list
		var tab_list = document.createElement('ul');
			tab_list.setAttribute('class','js-tablist');
			tab_list.setAttribute('data-existing-hx','h3');
		
		var tabs = [{id: 'overview', label: smart_ui.reporting.tabs.overview[smart_lang]}, {id: 'a11y-metadata', label: smart_ui.reporting.tabs.a11y[smart_lang]}, {id: 'conformance', label: smart_ui.reporting.tabs.conformance[smart_lang]}];
		
		if (_smartExtensionTabs.length > 0) {
			_smartExtensionTabs.forEach(function(tab) {
				if (_generateExtension.hasOwnProperty(tab.id) && _generateExtension[tab.id]) {
					tabs.push(tab);
				}
			});
		}
		
		tabs.push({id: 'additional-info', label: smart_ui.reporting.tabs.addinfo[smart_lang]});
		
		tabs.forEach(function(tab) {
			var tab_list_item = document.createElement('li');
				tab_list_item.setAttribute('class','js-tablist__item');
			
			var tab_link = document.createElement('a');
				tab_link.setAttribute('href','#'+tab.id);
				tab_link.setAttribute('id','label_'+tab.id);
				tab_link.setAttribute('class','js-tablist__link');
				tab_link.appendChild(document.createTextNode(tab.label));
			
			tab_list_item.appendChild(tab_link);
			tab_list.appendChild(tab_list_item);
		});
		
		header.appendChild(tab_list);
		
		// create test result details
		var testResults = createReportTestDetails();
		
		// create extension tabs
		var etabs = [];
		
		if (_smartExtensionTabs.length > 0) {
			_smartExtensionTabs.forEach(function(etab) {
				if (smart_extensions.hasOwnProperty(etab.id)) {
					if (_generateExtension.hasOwnProperty(etab.id) && _generateExtension[etab.id]) {
						etabs.push(smart_extensions[etab.id].generateReport());
					}
				}
			});
		}
		
		// create the report summary - has to occur after generating tabs as extension properties may depend on tab having been created 
		var reportSummary = createReportSummary();
		
		// add the accessibility metadata display statements 
		var a11yMetadata = createA11yMetadata();
		
		// add additional info details
		var additionalInfo = createReportAdditionalInfo({addedID: publicationInfo.addedID});
		
		// add statistics to the additional info section
		additionalInfo.appendChild(formatPubInfoEntry({
			id: 'result',
			label: smart_ui.reporting.sections.stats[smart_lang],
			value: createReportStats(testResults.count)
		}));
		
		// build the body
		wrapper.appendChild(reportSummary);
		wrapper.appendChild(a11yMetadata);
		wrapper.appendChild(testResults.content);
		etabs.forEach(function(etab) { wrapper.appendChild(etab)});
		wrapper.appendChild(additionalInfo);
		
		reportBody.appendChild(wrapper);
		
		return reportBody.innerHTML;
	}
	
	
	/* creates the report heading - the title of the publication */
	
	function createReportHeader() {
		var reportHD = document.createElement('h2');
			reportHD.setAttribute('id', 'title');
			reportHD.setAttribute('property', 'name');
			reportHD.appendChild(document.createTextNode(document.getElementById('title').value.trim()))
		return reportHD;
	}
	
	
	/* creates the line under the heading with the key publication info */
	
	function createReportPublicationInfo() {
		var publicationInfo = {};
		
		publicationInfo.content = document.createElement('div');
			publicationInfo.content.setAttribute('class', 'pubinfo');
		
		var info_fields = [{id: 'creator', property: 'author', pub_value: document.getElementById('creator').value.trim()}, {id: 'identifier', property: 'identifier', pub_value: document.getElementById('identifier').value.trim()}, {id: 'publisher', property: 'publisher', pub_value: document.getElementById('publisher').value.trim()}];
		
		// used to determine whether to add ID after title or in pub info section
		var addedID = false;
		
		for (var i = 0; i < info_fields.length; i++) {
		
			if (info_fields[i].pub_value) {
				
				var field_value = info_fields[i].pub_value;
				
				// mark whether the id has already been added
				if (info_fields[i].id == 'identifier') {
					if (!info_fields[i].pub_value.match(/^(ISBN|ISSN|DOI)/i)) {
						if (info_fields[i].pub_value.match(/^97[89]/)) {
							field_value = 'ISBN ' + info_fields[i].pub_value;
						}
						else {
							continue;
						}
					}
					publicationInfo.addedID = true;
				}
				
				publicationInfo.content.appendChild(formatReportTitleSubSpan({key: info_fields[i].id, value: field_value, property: info_fields[i].property}));
				if (((i+1) < info_fields.length) && info_fields[i+1].pub_value) { publicationInfo.content.appendChild(document.createTextNode(' | ')); }
			}
		}
		
		return publicationInfo;
	}
	
	
	/* creates the summary table of accessibility metadata on the first tab */
	
	function createReportSummary() {
	
		var summary = document.createElement('section');
			summary.setAttribute('id', 'overview');
			summary.setAttribute('class', 'js-tabcontent');
		
		var summaryHD = document.createElement('h3');
			summaryHD.appendChild(document.createTextNode(smart_ui.reporting.tabs.overview[smart_lang]));
		
		summary.appendChild(summaryHD);
		
		var summaryTable = document.createElement('div');
			summaryTable.setAttribute('class', 'summaryTable');
		
		var conf = document.getElementById('conformance-result').value;
		
		var result = document.getElementById('conformance-result-status').textContent.match(/^(?<status>Pass|Failed|Incomplete) — (?<spec>.*?)$/).groups;
		
		summaryTable.appendChild(formatPubInfoEntry({
			id: 'conformance-spec',
			label: smart_ui.reporting.tabs.eval[smart_lang],
			value: result.spec,
			property: (result.status == 'Pass' ? 'dcterms:conformsTo' : '')
		}));
		
		summaryTable.appendChild(formatPubInfoEntry({
			id: 'conformance-result',
			label: smart_ui.reporting.tabs.conformance[smart_lang],
			value: result.status,
			value_bg_class: ((conf == 'a' || conf == 'aa') ? 'pass' : conf)
		}));
		
		// add user extension properties
		if (Object.keys(smart_extensions).length > 0) {
			for (var key in smart_extensions) {
				var property = smart_extensions[key].addReportSummaryProperty();
				if (property && typeof(property) === 'object') {
					summaryTable.appendChild(formatPubInfoEntry(property));
				}
			}
		}
		
		var evaluator = document.getElementById('certifiedBy').value.trim();
		
		if (evaluator != '') {
			summaryTable.appendChild(formatPubInfoEntry({
				id: 'certifiedBy',
				label: smart_ui.a11yProperties.evaluator[smart_lang],
				value: evaluator
			}));
		}
		
		// add evaluation date
		var date = document.getElementById('certificationDate').value;
		
		if (date) {
			if (date.match(/\d+-\d+-\d+(T\d+-\d+-\d+Z)?/)) {
				date = smartFormat.convertUTCDateToString(date, 'notime')
			}
		}
		
		else {
			date = smartFormat.convertUTCDateToString(Date.now(), 'notime');
		}
		
		summaryTable.appendChild(formatPubInfoEntry({
			id: 'evaluation-date',
			label: smart_ui.reporting.addinfo.date[smart_lang],
			value: date
		}));
		
		// add the raw accessibilty metadata
		
		var recap = document.createElement('details');
		
		var recap_summary = document.createElement('summary');
			recap_summary.appendChild(document.createTextNode('Expand to view'));
		recap.appendChild(recap_summary);
		
		recap.appendChild( generateAccessibilityHTML() );
		
		summaryTable.appendChild(formatPubInfoEntry({
			id: 'raw-a11y-metadata',
			label: 'Accessibility Metadata',
			value: recap
		}));
		
		summary.appendChild(summaryTable);
		
		return summary;
	}
	
	/* generate the raw accessibility metadata as html */
	
	function generateAccessibilityHTML() {
		
		var dl = document.createElement('dl');
		
		// add accessibility features
		var dt_features = document.createElement('dt');
			dt_features.appendChild(document.createTextNode('Accessibility Features'));
		dl.appendChild(dt_features);
		
		dl.appendChild( createHTMLList('accessibilityFeature') );
		
		// add the summary
		var dt_summary = document.createElement('dt');
			dt_summary.appendChild(document.createTextNode('Accessibility Summary'));
		dl.appendChild(dt_summary);
		
		var dd = document.createElement('dd');
			dd.appendChild( document.createTextNode(document.getElementById('accessibilitySummary').value) );
		dl.appendChild(dd);
		
		// add hazards
		var dt_hazards = document.createElement('dt');
			dt_hazards.appendChild(document.createTextNode('Accessibility Hazards'));
		dl.appendChild(dt_hazards);
		
		dl.appendChild( createHTMLList('accessibilityHazard') );
		
		// add access modes
		var dt_am = document.createElement('dt');
			dt_am.appendChild(document.createTextNode('Access Modes'));
		dl.appendChild(dt_am);
		
		dl.appendChild( createHTMLList('accessMode') );
		
		// add sufficent access modes
		var dt_ams = document.createElement('dt');
			dt_ams.appendChild(document.createTextNode('Sufficient Access Modes'));
		dl.appendChild(dt_ams);
		
		dl.appendChild( addSufficientSetsHTML() );
		
		return dl;
	
	}
	
	function createHTMLList(id) {
	
		var checked_values = document.getElementById(id).querySelectorAll('input:checked');
		
		var ol = document.createElement('ul');
		
		if (checked_values.length) {
			for (var i = 0; i < checked_values.length; i++) {
				var li = document.createElement('li');
					li.appendChild(document.createTextNode(checked_values[i].value));
				ol.appendChild(li);
			}
		}
		
		else {
			var li = document.createElement('li');
				li.appendChild(document.createTextNode('Not specified.'));
			ol.appendChild(li);
		}
		
		return ol;
	}
	
	
	function addSufficientSetsHTML() {
	
		var ol = document.createElement('ul');
		
		var fieldsets = document.getElementById('accessModeSufficient').getElementsByTagName('fieldset');
		
		var hasSets = false;
		
		for (var i = 0; i < fieldsets.length; i++) {
		
			var checked_modes = fieldsets[i].querySelectorAll('input:checked');
			var sufficient_set = '';
			
			for (var j = 0; j < checked_modes.length; j++) {
				sufficient_set += sufficient_set ? ', ' : '';
				sufficient_set += checked_modes[j].value;
			}
			
			if (sufficient_set) {
				var li = document.createElement('li');
					li.appendChild(document.createTextNode(sufficient_set));
				ol.appendChild(li);
				hasSets = true;
			}
		}
		
		if (!hasSets) {
			var li = document.createElement('li');
				li.appendChild(document.createTextNode('Not specified.'));
			ol.appendChild(li);
		}
		
		return ol;
	}
	
	
	/* compile the accessibility metadata statements */
	
	function createA11yMetadata() {
		
		var summary = document.createElement('section');
			summary.setAttribute('id', 'a11y-metadata');
			summary.setAttribute('class', 'js-tabcontent');
		
		var summaryHD = document.createElement('h3');
			summaryHD.appendChild(document.createTextNode(smart_ui.reporting.tabs.a11y[smart_lang]));
		
		summary.appendChild(summaryHD);
			
		var xml = smartMetadata.generateAccessibilityMetadata('epub', true);
		
		if (!metaDisplayProcessor.initialize({
				record_as_text: xml
			})) {
			return;
		}
		
		var suppressNoInfo = true;
		
		var result = document.createElement('div');
			result.classList.add('grid');
		
		// 3.1 Ways of reading
		
		var ways_result = metaDisplayProcessor.processWaysOfReading();
		
		if (ways_result.hasMetadata || !suppressNoInfo) {
		
			result.appendChild(makeHeader('ways-of-reading'));
			
			// add grid styling to returned div
			ways_result.displayHTML.classList.add('grid-body');
	
			result.appendChild(ways_result.displayHTML);
		}
		
		// 3.2 Conformance
		
		var conf_result = metaDisplayProcessor.processConformance();
		
		if (conf_result.hasMetadata || !suppressNoInfo) {
		
			result.appendChild(makeHeader('conformance'));
			
			// add grid styling to returned div
			conf_result.displayHTML.classList.add('grid-body');
	
			result.appendChild(conf_result.displayHTML);
		}
		
		// 3.3 Navigation
		
		var nav_result = metaDisplayProcessor.processNavigation();
		
		if (nav_result.hasMetadata || !suppressNoInfo) {
		
			result.appendChild(makeHeader('navigation'));
			
			// add grid styling to returned div
			nav_result.displayHTML.classList.add('grid-body');
	
			result.appendChild(nav_result.displayHTML);
		}
		
		// 3.4 Rich content
		
		var rc_result = metaDisplayProcessor.processRichContent();
		
		if (rc_result.hasMetadata || !suppressNoInfo) {
		
			result.appendChild(makeHeader('rich-content'));
			
			// add grid styling to returned div
			rc_result.displayHTML.classList.add('grid-body');
	
			result.appendChild(rc_result.displayHTML);
		}
		
		// 3.5 Hazards
		
		var hazard_result = metaDisplayProcessor.processHazards();
		
		if (hazard_result.hasMetadata || !suppressNoInfo) {
		
			result.appendChild(makeHeader('hazards'));
			
			// add grid styling to returned div
			hazard_result.displayHTML.classList.add('grid-body');
	
			result.appendChild(hazard_result.displayHTML);
		}
		
		// 3.6 Accessibility summary
		
		var sum_result = metaDisplayProcessor.processAccessibilitySummary();
		
		if (sum_result.hasMetadata || !suppressNoInfo) {
		
			result.appendChild(makeHeader('accessibility-summary'));
			
			// add grid styling to returned div
			sum_result.displayHTML.classList.add('grid-body');
	
			result.appendChild(sum_result.displayHTML);
		}
		
		// 3.7 Legal considerations
		
		var legal_result = metaDisplayProcessor.processLegal();
		
		if (legal_result.hasMetadata || !suppressNoInfo) {
		
			result.appendChild(makeHeader('legal-considerations'));
			
			// add grid styling to returned div
			legal_result.displayHTML.classList.add('grid-body');
	
			result.appendChild(legal_result.displayHTML);
		}
		
		// 3.8 Additional accessibility information
		
		var aai_result = metaDisplayProcessor.processAdditionalA11yInfo();
		
		// additional information is never shown if there is nothing to display - it doesn't have a no information available string
		if (aai_result.hasMetadata) {
		
			result.appendChild(makeHeader('additional-accessibility-information'));
			
			// add grid styling to returned div
			aai_result.displayHTML.classList.add('grid-body');
	
			result.appendChild(aai_result.displayHTML);
		}
		
		summary.appendChild(result);
		
		return summary;
	}
	
	/* common header and explainer dialog */
	
	function makeHeader(id) {
	
		var hd_block = document.createElement('div');
			hd_block.classList.add('grid-hd');
		
		var hd_str = metaDisplayProcessor.getHeader(id, '');
		
		var hd = document.createElement('h4');
			hd.appendChild(document.createTextNode(hd_str + ':'));
		hd_block.appendChild(hd);
		
		return hd_block;
	}
	
	
	/* compile the table of success criteria statuses */
	
	function createReportTestDetails() {
	
		var result = {};
			result.content = document.createElement('section');
			result.content.setAttribute('id', 'conformance');
			result.content.setAttribute('class', 'js-tabcontent');
		
		var resultHD = document.createElement('h3');
			resultHD.appendChild(document.createTextNode(smart_ui.reporting.sections.results[smart_lang]));
		
		result.content.appendChild(resultHD);
		
		result.count = { pass: 0, partial: 0, fail: 0, na: 0, unverified: 0, obsolete: 0 };
		
		var showAA = document.getElementById('show-aa').checked;
		var showAAA = document.getElementById('show-aaa').checked;
		
		var resultTable = document.createElement('table');
			resultTable.classList.add('responsive');
			resultTable.id = 'epub_results';
			
		var resultThead = document.createElement('thead');
		var resultTheadRow = document.createElement('tr');
		
		var resultTheadSC = document.createElement('th');
			resultTheadSC.appendChild(document.createTextNode(smart_ui.reporting.table.headers.sc[smart_lang]));
			resultTheadSC.setAttribute('data-priority', '1');
		resultTheadRow.appendChild(resultTheadSC);
		
		var resultTheadLevel = document.createElement('th');
			resultTheadLevel.appendChild(document.createTextNode(smart_ui.reporting.table.headers.level[smart_lang]));
		resultTheadRow.appendChild(resultTheadLevel);
		
		var resultTheadResult = document.createElement('th');
			resultTheadResult.appendChild(document.createTextNode(smart_ui.reporting.table.headers.result[smart_lang]));
			resultTheadResult.setAttribute('data-priority', '2');
		resultTheadRow.appendChild(resultTheadResult);
		
		resultThead.appendChild(resultTheadRow);
		resultTable.appendChild(resultThead);
		
		var resultTbody = document.createElement('tbody');
		
		var criteria = document.querySelectorAll('.a, .aa, .aaa, .epub');
		
		// have to display SC the user has set the option to hide before generating otherwise they won't appear in the report
		var is_hidden = [];
		var hidden_types = document.querySelectorAll('fieldset#hide-status input:checked');
		
		if (hidden_types) {
			for (var i = 0; i < hidden_types.length; i++) {
				hidden_types[i].click();
				is_hidden.push(hidden_types[i].value);
			}
		}
		
		for (var i = 0; i < criteria.length; i++) {
			
			if (criteria[i].classList.contains('hidden')) {
				continue;
			}
			
			var conf_level = criteria[i].classList.contains('a') ? 'a' : (criteria[i].classList.contains('aa') ? 'aa' : (criteria[i].classList.contains('aaa') ? 'aaa' : 'epub'));
			
			// whether to include in stats for meeting the user specified wcag level
			var log = (conf_level == 'aaa' || smartWCAG.WCAGLevel() == 'a' && conf_level != 'a') ? false : true;
			
			var status = document.querySelector('input[name="'+criteria[i].id+'"]:checked').value;
			
			// skip AA (if A conformance) and AAA (all the time) SCs if not selected to show in config options
			if ((conf_level == 'aa' && smartWCAG.WCAGLevel() == 'a' && !showAA) || (conf_level == 'aaa' && !showAAA)) {
				continue;
			}
			
			// skip reporting AA (if A conformance) and AAA (all the time) SCs if they are n/a
			if ((conf_level == 'aaa' || (conf_level == 'aa' && smartWCAG.WCAGLevel() == 'a'))
					&& (status == 'unverified')) {
				continue;
			}
			
			var resultRow = document.createElement('tr');
			
			var resultColSC = document.createElement('th');
				resultColSC.appendChild(document.createTextNode((criteria[i].getElementsByClassName('label'))[0].textContent));
			resultRow.appendChild(resultColSC);
			
			var resultColLevel = document.createElement('td');
				resultColLevel.setAttribute('class', 'lvl');
				resultColLevel.appendChild(document.createTextNode(conf_level.toUpperCase()));
			resultRow.appendChild(resultColLevel);
			
			var resultColStatus = document.createElement('td');
				resultColStatus.setAttribute('class', status);
			
			var resultColStatusLabel = document.createElement('p');
				resultColStatusLabel.setAttribute('class', 'label');
			
			if (status == 'pass') {
				resultColStatusLabel.appendChild(document.createTextNode(smart_ui.reporting.table.results.pass[smart_lang]));
				resultColStatus.appendChild(resultColStatusLabel);
				if (log) {
					result.count.pass += 1;
				}
			}
			
			else if (status == 'partial') {
				var err = document.getElementById(criteria[i].id+'-err').value;
				resultColStatusLabel.appendChild(document.createTextNode(smart_ui.reporting.table.results.partial[smart_lang]));
				resultColStatus.appendChild(resultColStatusLabel);
				
				// add the reason 
				if ((err != '') && (_notesToDisplay == 'all' || _notesToDisplay == 'failures')) {
					var lines = err.trim().split(/[\r\n]+/);
					lines.forEach(function(line) {
						if (line) {
							var notePara = document.createElement('p');
								notePara.appendChild(document.createTextNode(line));
							resultColStatus.appendChild(notePara);
						}
					});
				}
				
				if ((criteria['name'] != 'EPUB') || ((criteria['name'] == 'EPUB') && (criteria[i].id != 'eg-2'))) {
					if (log) {
						result.count.partial += 1;
					}
				}
			}
			
			else if (status == 'fail') {
				var err = document.getElementById(criteria[i].id+'-err').value;
				resultColStatusLabel.appendChild(document.createTextNode(smart_ui.reporting.table.results.fail[smart_lang]));
				resultColStatus.appendChild(resultColStatusLabel);
				
				// add the reason 
				if ((err != '') && (_notesToDisplay == 'all' || _notesToDisplay == 'failures')) {
					var lines = err.trim().split(/[\r\n]+/);
					lines.forEach(function(line) {
						if (line) {
							var notePara = document.createElement('p');
								notePara.appendChild(document.createTextNode(line));
							resultColStatus.appendChild(notePara);
						}
					});
				}
				
				if ((criteria['name'] != 'EPUB') || ((criteria['name'] == 'EPUB') && (criteria[i].id != 'eg-2'))) {
					if (log) {
						result.count.fail += 1;
					}
				}
			}
			
			else if (status == 'na') {
				resultColStatusLabel.appendChild(document.createTextNode(smart_ui.reporting.table.results.na[smart_lang]));
				resultColStatus.appendChild(resultColStatusLabel);
				if (log) {
					result.count.na += 1;
				}
			}
			
			else if (status == 'obsolete') {
				resultColStatusLabel.appendChild(document.createTextNode(smart_ui.reporting.table.results.obsolete[smart_lang]));
				resultColStatus.appendChild(resultColStatusLabel);
				if (log) {
					result.count.obsolete += 1;
				}
			}
			
			else {
				resultColStatusLabel.appendChild(document.createTextNode(smart_ui.reporting.table.results.unchecked[smart_lang]));
				resultColStatus.appendChild(resultColStatusLabel);
				if (log) {
					result.count.unverified += 1;
				}
			}
			
			if (_notesToDisplay == 'all' || _notesToDisplay == 'notes') {
				if (document.getElementById(criteria[i].id+'-notebox').checked) {
					var noteLabel = document.createElement('p');
						noteLabel.setAttribute('class', 'label');
						noteLabel.appendChild(document.createTextNode(smart_ui.reporting.tabs.addinfo[smart_lang]+':'));
					resultColStatus.appendChild(noteLabel);
					
					var noteText = document.getElementById(criteria[i].id+'-info').value;
					var lines = noteText.trim().split(/[\r\n]+/);
					lines.forEach(function(line) {
						if (line) {
							var notePara = document.createElement('p');
								notePara.appendChild(document.createTextNode(line));
							resultColStatus.appendChild(notePara);
						}
					});
				}
			}
			
			resultRow.appendChild(resultColStatus);
			resultTbody.appendChild(resultRow);
		}
		
		resultTable.appendChild(resultTbody);
		result.content.appendChild(resultTable);
		
		// re-hide any SC previously forced to make visible
		if (is_hidden.length > 0) {
			is_hidden.forEach(function(status) {
				var hide_chkbox = document.querySelector('fieldset#hide-status input.hide_sc[value="' + status + '"]');
				hide_chkbox.click();
			});
		}
		
		return result;
	}
	
	
	/* generates the addition info tab */
	
	function createReportAdditionalInfo(options) {
	
		options = typeof(options) === 'object' ? options : {};
		options.addedID = options.hasOwnProperty('addedID') ? options.addedID : false;
		
		var additionalInfo = document.createElement('section');
			additionalInfo.setAttribute('id','additional-info');
			additionalInfo.setAttribute('class', 'info js-tabcontent');
		
		var additionalInfoHD = document.createElement('h3');
			additionalInfoHD.appendChild(document.createTextNode(smart_ui.reporting.tabs.addinfo[smart_lang]));
		
		additionalInfo.appendChild(additionalInfoHD);
		
		// add epub version
		additionalInfo.appendChild(formatPubInfoEntry({
			id: 'format',
			label: smart_ui.reporting.addinfo.format[smart_lang],
			value: 'EPUB ' + document.querySelector('select#epub-format').value
		}));
		
		
		// add the identifier if it's not already under the heading
		if (!options.addedID) {
			additionalInfo.appendChild(formatPubInfoEntry({
				id: 'identifier',
				label: smart_ui.reporting.addinfo.id[smart_lang],
				value: document.getElementById('identifier').value.trim()
			}));
		}
		
		additionalInfo.appendChild(formatPubInfoEntry({
			id: 'modified',
			label: smart_ui.reporting.addinfo.modified[smart_lang],
			value: document.getElementById('modified').value.trim()
		}));
		
		additionalInfo.appendChild(formatPubInfoEntry({
			id: 'date',
			label: smart_ui.reporting.addinfo.published[smart_lang],
			value: document.getElementById('date').value.trim()
		}));
		
		additionalInfo.appendChild(formatPubInfoEntry({
			id: 'description',
			label: smart_ui.reporting.addinfo.desc[smart_lang],
			value: document.getElementById('description').value.trim()
		}));
		
		additionalInfo.appendChild(formatPubInfoEntry({
			id: 'subject',
			label: smart_ui.reporting.addinfo.subject[smart_lang],
			value: document.getElementById('subject').value.trim()
		}));
		
		var optional_meta = document.getElementById('optional-meta').value.trim();
		
		
		// process any metadata in the addition metadata box
		if (optional_meta != '') {
			var meta = optional_meta.replace(/\r\n/g,'\n').split('\n');
			for (var i = 0; i < meta.length; i++) {
				var part = meta[i].split(': ');
				additionalInfo.appendChild(formatPubInfoEntry({
					id: part[0].toLowerCase().replace(/\s/g,''),
					label: part[0],
					value: part[1]
				}));
			}
		}
		
		return additionalInfo;
	}
	
	
	/* get the count of pass/fail/na/unverified SCs */
	
	function createReportStats(count) {
		
		var stats = count.pass + ' ' + smart_ui.conformance.result.pass[smart_lang];

		if (count.partial) {
			stats += ', ' + count.partial + ' ' + smart_ui.conformance.result.partial[smart_lang];
		}

		if (count.fail) {
			stats += ', ' + count.fail + ' ' + smart_ui.conformance.result.fail[smart_lang];
		}
		
		if (count.obsolete) {
			stats += ', ' + count.obsolete + ' ' + smart_ui.conformance.result.obsolete[smart_lang]; 
		}
		
		if (count.unverified) {
			stats += ', ' + count.unverified + ' ' + smart_ui.conformance.result.unverified[smart_lang]; 
		}
		
		if (count.na) {
			stats += ', ' + count.na + ' ' + smart_ui.conformance.result.na[smart_lang];
		}
		
		return stats;
	}
	
	
	/* return discovery metadata sets */
	
	function compileCheckboxValues(id) {
		var checkboxes = document.getElementById(id).querySelectorAll('input:checked');
		
		var value_list = document.createElement('ul');
		
		for (var i = 0; i < checkboxes.length; i++) {
			var property_li = document.createElement('li');
				property_li.setAttribute('property', id);
				
				if (id == 'accessibilityFeature') {
					// add formal value for machine processing to avoid the plain english description being picked up
					property_li.setAttribute('content', checkboxes[i].value)
				}
				
				property_li.appendChild(document.createTextNode(checkboxes[i].parentNode.textContent.trim()));
			
			value_list.appendChild(property_li); 
		}
		
		if (!value_list.hasChildNodes()) {
			if (id == 'accessibilityHazard') {
				return smart_ui.reporting.unspecified[smart_lang];
			}
		}
		
		else {
			return value_list;
		}
		
		return '';
	}
	
	
	/* generates the html markup for the info table in the first tab */
	
	function formatPubInfoEntry(options) {
	
		options = typeof(options) === 'object' ? options : {};
		options.id = options.id ? options.id : '';
		options.label = options.label ? options.label : '';
		options.property = options.property ? options.property : '';
		options.value = options.value ? options.value : '';
		options.value_bg_class = options.value_bg_class ?  ' ' + options.value_bg_class : '';
		
		if (!options.value) {
			return document.createTextNode(' ');
		}
		
		var entry = document.createElement('div');
		
		if (options.id) {
			entry.setAttribute('id', options.id);
		}
		
		var label = document.createElement('div');
			label.setAttribute('class','label');
			label.appendChild(document.createTextNode(options.label+':'));
		
		entry.appendChild(label);
		entry.appendChild(document.createTextNode(' '));
		
		var value;
		
		if (typeof(options.value) === 'string') {
			value = document.createElement('div');
			value.setAttribute('class', options.value_bg_class ? 'value ' + options.value_bg_class : 'value');
			
			if (options.property) {
				value.setAttribute('property', options.property);
			}
			value.appendChild(document.createTextNode(options.value));
		}
		
		else if (options.value.tagName.toLowerCase().match(/^(a|ul|details)$/)) {
			value = document.createElement('div');
			value.setAttribute('class', options.value_bg_class ? 'value ' + options.value_bg_class : 'value');
			value.appendChild(options.value);
		}
		
		else {
			value = options.value;
		}
		
		entry.appendChild(value);
		
		return entry;
	}
	
	
	/* generates a segment for the line under the heading */
	
	function formatReportTitleSubSpan(options) {
		var span = document.createElement('span');
			span.setAttribute('id', options.property);
			
			if (options.property) {
				span.setAttribute('property', options.property);
			}
			
			span.appendChild(document.createTextNode(options.value));
		return span;
	}
	
	
	
	/* adds the result from an extension module to the first tab */
	
	function addExtensionResult(options) {
	
		/* 
		 * options.label - default label to display (e.g. "Conformance Result:");
		 * options.default - default score value
		 * options.score_id - id for updating/accessing the user-facing value
		 * options.value_id - id for updating/accessing the machine-processable value
		 */
		
		var extResultDiv = document.createElement('div');
			extResultDiv.setAttribute('class','conformance-result');
		
		var extResultLabel = document.createElement('strong');
			extResultLabel.appendChild(document.createTextNode(options.label));
		
		extResultDiv.appendChild(extResultLabel);
		
		var extResultScore = document.createElement('span');
			extResultScore.setAttribute('id',options.score_id);
			extResultScore.appendChild(document.createTextNode(options.default));
		
		extResultDiv.appendChild(extResultScore);
		
		var extResultValue = document.createElement('input');
			extResultValue.setAttribute('type','hidden');
			extResultValue.setAttribute('name',options.value_id);
			extResultValue.setAttribute('id',options.value_id);
			extResultValue.setAttribute('value',options.default.toLowerCase());
		
		extResultDiv.appendChild(extResultValue);
		
		document.getElementById('extension-results').appendChild(extResultDiv);
	}
	
	
	
	return {
		addExtensionTab: function(tab_info) {
			_smartExtensionTabs.push(tab_info);
		},
		
		validateConformanceReport: function() {
			return validateConformanceReport();
		},
		
		generateConformanceReport: function(location) {
			generateConformanceReport(location);
		},
		
		setNoteOutput: function(code) {
			_notesToDisplay = code;
		},
		
		setExtensionTabOutput: function(tab,output) {
			_generateExtension[tab] = output;
		},
		
		addExtensionResult: function(options) {
			addExtensionResult(options);
		},
		
		showOptions: function() {
			if (output_options_dialog) {
				output_options_dialog.dialog('open');
			}
		}
	}

})();


/* zero pad times */
Number.prototype.pad = function (len) {
	return (new Array(len+1).join("0") + this).slice(-len);
}
