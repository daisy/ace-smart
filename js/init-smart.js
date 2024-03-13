
	'use strict';
	
	/*
	 *  REPORTING
	 */
	
	window.onload = function() {
	
		/* add next tab links */
		var $js_tabs = $( ".js-tabcontent" );
		for (var i = 0; i < $js_tabs.length - 1; i++) {
		
			var link_div = document.createElement('div'); 
				link_div.setAttribute('class','link');
			
			var next_tab = $js_tabs[i+1];
			
			var link = document.createElement('a');
				link.setAttribute('href','#' + next_tab.id);
				link.setAttribute('class','js-link-to-tab');
				link.appendChild(document.createTextNode('Continue to ' + next_tab.querySelector('h2, h3').textContent));
			
			link_div.appendChild(link);
			
			$js_tabs[i].appendChild(link_div);
		}

		/* watch for changes to epub accessibility version */
		$('select#epub-a11y').change( function(){
			smartConformance.setEPUBA11yVersion(this.value);
		});
		
		/* watch for changes to wcag version */
		$('select#wcag-version').change( function(){
			smartConformance.setWCAGVersion(this.value, true);
		});
		
		/* watch for changes to sc filter */
		$('select#filterSC').change( function(){
			smartConformance.displaySuccessCriteria();
		});
		
		/* watch for changes to success criteria status radio buttons */
		$('input.sc_status').click( function(){
			smartConformance.setSCStatus({name: this.name, value: this.value});
		});
		
		/* watch for clicks to show/hide success criteria note fields */
		$('input.show-note').click( function(){
			smartConformance.showSCNoteField(this);
		});
		
		/* add discovery metadata fields */
		smartDiscovery.addDiscoveryMetadata();
		
		/* add distribution metadata fields */
		smartDistribution.addDistributionMetadata();
		
		/* configure and populate the evaluation */
		evaluationSetup();
		
		/* disable SC 4.1.1 */
		var sc411_inputs = document.querySelectorAll('fieldset#sc-4\\.1\\.1-legend input');
		for (var i = 0; i < sc411_inputs.length; i++) {
			sc411_inputs[i].disabled = true;
		}
    	
    	// call data mods for extensions that have to occur after the data has loaded
    	extension_scripts();
    	
		/* 
		 * reset saveChanges after configuring the evaluation,
		 * otherwise users are always alerted to save changes to their 
		 * evaluations when exiting
		 */
		saveChanges = false;
	}
	
	function evaluationSetup() {
		
		/* json to load is always written to the script element with id=report_data */
		var raw_report = document.getElementById('report_data').textContent;
		
		var data = JSON.parse(raw_report);
		
		/* 
		 * only saved/new evaluations have a category property in their root data structure,
		 * so can act accordingly based on its presence
		 */
		 
		if (data.hasOwnProperty('category')) {
			/* note that 'savedReport' is the old identifier (before the evaluation management
			 * code was added) - it can be removed once fully obsolete */
			if (data.category == 'savedEvaluation' || data.category == 'savedReport') {
				smartManage.loadConformanceEvaluation(data);
			}
			else if (data.category == 'newEvaluation') {
				// only the title to set if a new blank evaluation
				document.getElementById('title').value = data.title;
				
				// temporary patch until site default becomes 2.2
				if (smart_extensions.hasOwnProperty('born_accessible')) {
					document.getElementById('wcag-version').value = '2.2';
					smartConformance.setWCAGVersion('2.2');
				}
				
			}
		}
		
		else {
			smartAce.storeReportJSON(data);
			smartAce.loadAceReport();
		}
	}

	
	
	
	/* 
	 * ERROR HANDLING
	 */
	 
	// initialize error reporting
	smartError.init();
	
	
	
	/* 
	 * DIALOG CONFIGURATION
	 */

	// initialize dialogs
	
	/* import_dialog is used to show the user the results of importing their ace report */
	var import_dialog = $("#import").dialog({
		autoOpen: false,
		height: 350,
		modal: true,
		buttons: {
			Close: function() {
				import_dialog.dialog( "close" );
			}
		}
	});
	
	/* save_dialog provides the option to save evaluations remotely/locally */
	var save_buttons = {};
		save_buttons[smart_ui.buttons.save[smart_lang]] = function() {
			smartManage.saveConformanceEvaluation($('input[name="location"]:checked').val())
		};
		save_buttons[smart_ui.buttons.close[smart_lang]] = function() {
			$(this).dialog('close');
		};

	var save_dialog = $("#save").dialog({
		autoOpen: false,
		height: 220,
		modal: true,
		buttons: save_buttons
	});
	
	var close_button = {};
		close_button[smart_ui.buttons.close[smart_lang]] = function() {
			$(this).dialog('close');
		};

	/* options_dialog is used to show the additional conformance options */
	options_dialog = $("#conformance-options").dialog({
		autoOpen: false,
		height: 360,
		width: 600,
		modal: true,
		buttons: close_button
	});
	
	/* discovery_dialog is used to show the generated discovery tab metadata (it is initialized in the smartDiscovery module) */
	discovery_dialog = $("#discovery-meta").dialog({
		autoOpen: false,
		height: 450,
		modal: true,
		buttons: close_button
	});
	
	/* onix_dialog is used to show the generated distribution tab metadata (it is initialized in the smartReport module) */
	onix_dialog = $("#distribution-meta").dialog({
		autoOpen: false,
		height: 450,
		modal: true,
		buttons: close_button
	});
	
	/* output_options_dialog is used to show the additional conformance options */
	output_options_dialog = $("#output-options").dialog({
		autoOpen: false,
		height: 425,
		width: 600,
		modal: true,
		buttons: close_button
	});
	
	/* evaluation_dialog is used to show the generated evaluation tab metadata (it is initialized in the smartEvaluation module) */
	evaluation_dialog = $("#evaluation-meta").dialog({
		autoOpen: false,
		height: 350,
		modal: true,
		buttons: close_button
	});
	
	function adjustDialogWidth() {
		if (document.body.clientWidth < 550) {
			import_dialog.dialog("option", "width", 300);
			discovery_dialog.dialog("option", "width", 400);
			evaluation_dialog.dialog("option", "width", 400);
			onix_dialog.dialog("option", "width", 400);
			save_dialog.dialog("option", "width", 400);
		}
		else {
			import_dialog.dialog("option", "width", 550);
			discovery_dialog.dialog("option", "width", 750);
			evaluation_dialog.dialog("option", "width", 750);
			onix_dialog.dialog("option", "width", 750);
			save_dialog.dialog("option", "width", 400);
		}
	}
	
	// initial set
	adjustDialogWidth();
	
	// readjust dialog on browser resize
	$( window ).resize(function() {
		adjustDialogWidth();
	});
	
	
	
	/* 
	 * EVENT HANDLING
	 */
	
	
	/* INTERFACE */
	
	/* watch for validate button click */
	$('#validate-button').click( function(){
		if (smartReport.validateConformanceReport()) {
			alert(smart_ui.eval.clean[smart_lang]);
		}
		else {
			alert(smart_ui.eval.error[smart_lang]);
		}
	});
	
	/* watch for save button click */
	$('#save-button').click( function(){
		/* shared accounts cannot save remotely */
		if (ACE_SHARED == 1) {
			smartManage.saveConformanceEvaluation('local');
		}
		else {
			save_dialog.dialog('open');
		}
		return false;
	});
	
	/* watch for close button click */
	$('#close-button').click( function() {
		document.location.href = 'index.php';
	});
	
	/* watch for error pane close click */
	$('#error-pane-close').click( function() {
		smartError.hideErrorPane();
	});
	
	
	/* START TAB */
	
	/* watch for EPUB format changes */
	$('select#epub-format').change( function() {
		smartFormat.setEPUBVersion(this.value);
	});
	
	/* watch for timestamp add */
	$('#add-timestamp').click( function() {
		document.getElementById('modified').value = smartFormat.convertUTCDateToString(Date.now());
	});
	
	
	/* CONFORMANCE TAB */
	
	/* watch for wcag conformance level changes */
	$('select#wcag-level').change( function(){
		smartConformance.setWCAGConformanceLevel(this.value);
	});
	
	/* watch for optional criteria display changes */
	$('input.optional-criteria').click( function(){
		smartConformance.displaySuccessCriteria();
	});
	
	/* watch for filtering of success criteria by status */
	$('input.hide_sc').click( function(){
		smartConformance.filterSCByStatus(this);
	});
	
	/* watch for filtering of success criteria by content type */
	$('input.excl-test').click( function(){
		smartConformance.configureContentTypeTests({type: this.value, exclude: this.checked});
	});
	
	
	
	
	/* DISCOVERY TAB */
	
	/* watch for click to generate discovery metadata */
	$('#discovery_button').click( function(){
		smartDiscovery.generateDiscoveryMetadata();
	});
	
	/* watch for click on button to copy evaluation metadata */
	$('#discovery-copy').click( function(){
		if (smartFormat.copyToClipboard('discovery-metadata')) {
			alert('Text successfully copied.');
		}
		else {
			alert('Failed to copy text.');
		}
	});
	
	
	
	
	/* DISTRIBUTION TAB */
	
	/* watch for click to generate discovery metadata */
	$('#distribution_button').click( function(){
		smartDistribution.generateONIXMetadata();
	});
	
	/* watch for click on button to copy evaluation metadata */
	$('#distribution-copy').click( function(){
		if (smartFormat.copyToClipboard('distribution-metadata')) {
			alert('Text successfully copied.');
		}
		else {
			alert('Failed to copy text.');
		}
	});
	
	
	
	/* EVALUATION TAB */
	
	/* watch for click on button to generate evaluation metadata */
	$('#generate-evaluation-metadata').click( function(){
		smartEvaluation.generateEvaluationMetadata();
	});
	
	/* watch for click on button to copy evaluation metadata */
	$('#evaluation-copy').click( function(){
		if (smartFormat.copyToClipboard('evaluation-metadata')) {
			alert('Text successfully copied.');
		}
		else {
			alert('Failed to copy text.');
		}
	});
	
	
	/* REPORTING TAB */
	
	/* watch for changes to note output */
	$('input[name="show-notes"]').click( function(){
		smartReport.setNoteOutput(this.value);
	});
	
	/* watch for click on button to generate final report preview */
	$('#preview-report').click( function(){
		smartReport.generateConformanceReport('preview'); 
	});

	/* watch for click on button to generate final report download */
	$('#generate-report').click( function(){
		smartReport.generateConformanceReport('report');
	});
	
	
	/* catch ctrl+m to view the message panel */
	function OpenMsgPanel(e) {
		var evtobj = window.event? event : e
		if (evtobj.keyCode == 77 && evtobj.ctrlKey) { smartError.showErrorPane(); };
	}
	document.onkeydown = OpenMsgPanel;
	
	/* Save changes prompt */
	
	/* 
	 * if any form fields are changed, saveChanges is set to true to prompt
	 * the user that they might be exiting without saving their work
	 */
	$(":input").change(function() {
		saveChanges = true;
	});
	
	$(window).on("beforeunload",function(){
		/* 
		 * these message are not displayed, but do trigger the browser default
		 * prompt about leaving with unsaved changes
		 */
		if (firstSave) {
			return smart_ui.save.first[smart_lang];
		}
		if (saveChanges) {
			return smart_ui.save.changes[smart_lang];
		}
	});
