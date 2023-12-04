
	// drag-drop form for next page
	var nextStep = document.getElementById('nextStep');
	
	/* 
	 * DIALOG CONFIGURATION
	 */

	// initialize dialogs
	
	var import_dialog = $("#import").dialog({
		autoOpen: false,
		height: 145,
		width: 500,
		modal: true,
		buttons: {
			'Open': function() {
				$('#file').prop("files", document.getElementById('local-eval').files);
				nextStep.submit();
			},
			'Close': function() {
				import_dialog.dialog( "close" );
			}
		}
	});
	
	var error_dialog = $("#error").dialog({
		autoOpen: false,
		height: 200,
		width: 500,
		modal: true,
		buttons: {
			'Close': function() {
				error_dialog.dialog( "close" );
			}
		}
	});
	
	
	/* 
	 * DATA TABLES
	 */
	
	var dt = new DT();
	
	$(document).ready(function(){
		setView();
	});
	
	function setView() {
		var options = {
			'searchable': true,
			'setDefaultSort': true,
			'changeDefaultSort': false,
			'tableType': ''
    }
		dt.initialize(options);
	}
	
	
	/*
	 * ERROR REPORTING
	 * 
	 * - detects errors in the query string coming back from failed report loads:
	 *   https://smart.daisy.org/index.php?err=foo
	 */
	
	var error_code = getParameterByName('err');
	
	if (error_code) {
		var error_msg = smart_errors.loadErrors.hasOwnProperty(error_code) ? smart_errors.loadErrors[error_code][smart_lang] : smart_errors.unknown[smart_lang];
		document.getElementById('error-msg').textContent = error_msg;
		error_dialog.dialog('open');
	}

	
	function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, '\\$&');
		var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}
	
		
	/* 
	 * EVENT HANDLING
	 */
	
	
	/* evaluation option button clicks */
	
	$('input[type="image"]').click( function(){
		
		var operation = this.id.substring(0,3);
		var eval_id = this.id.replace(/^[_a-z]+/i,'');
		
		if (operation == 'del') {
			var action = document.getElementById('alert_full_delete') ? smart_ui.evalDelete[smart_lang] : smart_ui.evalDeleteStored[smart_lang];
			
			if (confirm(action + ' ' + smart_ui.noUndo[smart_lang])) {
				document.getElementById('id').value = eval_id;
				document.getElementById('action').value = 'delete';
				nextStep.action = 'index.php';
				nextStep.submit();
			}
		}
		
		else if (operation == 'rel') {
			document.getElementById('id').value = eval_id;
			document.getElementById('action').value = 'reload';
			import_dialog.dialog('open');
		}
		
		else if (operation == 'res') {
			document.getElementById('id').value = eval_id;
			document.getElementById('action').value = 'resume';
			nextStep.action = 'smart.php';
			nextStep.submit();
		}
	});
	
	
	/* add a new blank evaluation */
	
	$('#new_eval').click( function() {
	
		event.preventDefault();
		
		var title = prompt(smart_ui.evalTitle[smart_lang]);
		
		title = title ? title.trim() : title;
		
		if (!title) {
			alert(smart_errors.noEvalTitle[smart_lang]);
			return;
		}
		
		document.getElementById('title').value = title;
		document.getElementById('action').value = 'new';
		nextStep.submit();
	});
