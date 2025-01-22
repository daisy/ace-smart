<?php require_once 'users/init.php' ?>
<?php require_once 'php/version.php' ?>

<?php
	if (isset($_POST['auto']) && !empty($_POST['auto'])) {
		$validate = new Validate();
		$validation = $validate->check($_POST, array(
			'username' => array('display' => 'Username','required' => true),
			'password' => array('display' => 'Password', 'required' => true)));
		if ($validation->passed()) {
			$user = new User();
			$login = $user->loginEmail(Input::get('username'), trim(Input::get('password')), false);
			if (!$login) {
				http_response_code(401);
				Redirect::to('index.php');
				exit();
			}
		}
		else {
			http_response_code(401);
			Redirect::to('index.php');
			exit();
		}
	}
	
	else {
		if (!securePage($_SERVER['PHP_SELF'])) { die(); }
	}
?>

<?php require_once 'extensions/config.php' ?>

<?php require_once 'php/evaluations.php' ?>
<?php require_once 'php/extensions.php' ?>
<?php require_once 'sc/sc.php' ?>

<?php
	if ((!isset($_POST['action']) || empty($_POST['action'])) && (!isset($_POST['auto']) || empty($_POST['auto']))) { header("Location: index.php"); die(); }
	
	$eval = new SMART_EVALUATION(array(
		'username' => $user->data()->username,
		'company' => $user->data()->company,
		'shared' => $user->data()->shared,
		'license' => $user->data()->license,
		'title' => (isset($_POST['title']) && !empty($_POST['title'])) ? $_POST['title'] : 'Untitled',
		'action' => (isset($_POST['action']) && !empty($_POST['action'])) ? $_POST['action'] : (isset($_POST['auto']) ? 'autoload' : ''),
		'id' => $_POST['id'],
		'pubid' => isset($_POST['pubid']) && !empty($_POST['pubid']) ? $_POST['pubid'] : ''
	));
	
	$eval->check_license();
	
	$ext = new SMART_EXTENSIONS($user->data()->modules, $extension);
	$sc = new SMART_SC_GENERATOR();
?>

<!DOCTYPE html>
<html lang="en" prefix="dcterms: http://purl.org/dc/terms/ schema: http://schema.org/" typeof="schema:WebPage">
	<head>
		<meta charset="utf-8"/>
		<title>EPUB Evaluation - Ace SMART</title>
		<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"/>
		<link rel="stylesheet" type="text/css" href="css/a11y.css<?= '?v=' . $smart_version ?>"/>
		<link rel="stylesheet" type="text/css" href="css/tabs.css<?= '?v=' . $smart_version ?>"/>
		<link rel="stylesheet" type="text/css" href="css/a11y-meta-wizard.css<?= '?v=' . $smart_version ?>">
				
		<?php $ext->print_css(); ?>
		
		<meta name="viewport" content="width=device-width, initial-scale=1"/>
		
		<!-- DC metadata --> 
		<meta property="dcterms:created" content="2017-03-02"/>
		<meta property="dcterms:description" content="The Ace SMART tool aids in the evaluation of EPUB publications for conformance to the EPUB Accessibility specification."/>
		<meta property="dcterms:language" content="en"/>
		
		<!-- schema.org a11y metadata -->
		<meta property="schema:accessibilityFeature" content="structuralNavigation"/>
		<meta property="schema:accessibilityFeature" content="displayTransformability"/>
		<meta property="schema:accessMode" content="textual"/>
		<meta property="schema:accessModeSufficient" content="textual"/>
		<meta property="schema:accessibilityHazard" content="none"/>
		
		<link rel="icon" type="image/x-icon" href="https://smart.daisy.org/favicon.ico" sizes="any"/>
		
		<script async src="https://www.googletagmanager.com/gtag/js?id=G-MPVGJVDGL8"></script>
		<script>
			window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('js', new Date());
			gtag('config', 'G-MPVGJVDGL8');
		</script>
		
		<script id="report_data" type="application/json">
			<?= $eval->load_evaluation() ?>
		</script>
		
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
		<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
		<script>(function(e,t,n){var r=e.querySelectorAll("html")[0];r.className=r.className.replace(/(^|\s)no-js(\s|$)/,"$1js$2")})(document,window,0);</script>
		<?php echo <<<JS
		<script>
			var smart_lang = 'en';
			var smart_locale = 'en-us';
			var smart_extensions = {};
			var ACE_USER = '{$user->data()->username}';
			var ACE_SHARED = '{$user->data()->shared}';
			var ACE_USER_CO = '{$user->data()->company}';
			var ACE_ACTION = '{$eval->get_action()}';
			var ACE_ID = '{$eval->get_eval_id()}';
			var saveChanges = false;
			var firstSave = {$eval->need_to_save()};
			var noDesignElements = {$user->data()->baDesignElementsOff};
						
			var meta_wiz_dialog;
		</script>
JS;
?>
		<script src="js/config/messages.js<?= '?v=' . $smart_version ?>"></script>
		<script src="js/ace.js<?= '?v=' . $smart_version ?>"></script>
		<script src="js/manage.js<?= '?v=' . $smart_version ?>"></script>
		<script src="js/error.js<?= '?v=' . $smart_version ?>"></script>
		<script src="js/format.js<?= '?v=' . $smart_version ?>"></script>
		<script src="js/wcag.js<?= '?v=' . $smart_version ?>"></script>
		<script src="js/reporting.js<?= '?v=' . $smart_version ?>"></script>
		<script src="js/extensions.js<?= '?v=' . $smart_version ?>"></script>
		
		<script src="js/a11ytabs.js<?= '?v=' . $smart_version ?>" defer></script>
		<script src="js/conformance.js<?= '?v=' . $smart_version ?>" defer></script>
		<script src="js/config/discovery.js<?= '?v=' . $smart_version ?>" defer></script>
		<script src="js/discovery.js<?= '?v=' . $smart_version ?>" defer></script>
		<script src="js/config/distribution.js<?= '?v=' . $smart_version ?>" defer></script>
		<script src="js/distribution.js<?= '?v=' . $smart_version ?>" defer></script>
		<script src="js/evaluation.js<?= '?v=' . $smart_version ?>" defer></script>
		<script src="js/init-smart.js<?= '?v=' . $smart_version ?>" defer></script>
		<style>
			h1 { font-size: 2rem; }
		</style>
	</head>
	
	<body class="tabs">
		<header>
			<h1><img src="images/daisy_high.jpg" class="logo" alt="DAISY"/> <span property="dcterms:title">Ace <span class="smart_hd">SMART</span> &#8212; Evaluation</span></h1>
			
			<nav class="appmenu" aria-label="application menu">
				<a href="#" id="validate-button"><img src="images/validate.png" alt="validate" title="Validate"/></a>
				<a href="#" id="save-button"><img src="images/save.png" alt="save" title="Save"/></a>
				<a href="#" id="close-button"><img src="images/close_app.png" alt="close" title="Close"/></a>
			</nav>
		</header>
		
		<main class="js-tabs">
			<ul class="js-tablist" data-existing-hx="h3">
				<li class="js-tablist__item">
					<a href="#start" id="label_start" class="js-tablist__link">Pub Info</a>
				</li>
				<li class="js-tablist__item">
					<a href="#conformance" id="label_conformance" class="js-tablist__link">Conformance</a>
				</li>
				<?php $ace_extension_tabs = $ext->print_tabs(); ?>
				<li class="js-tablist__item">
					<a href="#discovery" id="label_discovery" class="js-tablist__link">Discovery</a>
				</li>
				<li class="js-tablist__item">
					<a href="#distribution" id="label_distribution" class="js-tablist__link">Distribution</a>
				</li>
				<li class="js-tablist__item">
					<a href="#evaluation" id="label_evaluation" class="js-tablist__link">Result</a>
				</li>
				<li class="js-tablist__item">
					<a href="#generate" id="label_generate" class="js-tablist__link">Reporting</a>
				</li>
			</ul>
	
			<form class="report">
				<section id="start" class="js-tabcontent">
					<h2>Publication Information</h2>
					
					<p class="help"><a href="user-guide/pub-info.html" target="_blank">Need help?</a></p>
					
					<p class="instr">Required fields for final report are denoted by an asterisk.</p>
						
					<div class="data form-data">
						<fieldset class="flat">
							<legend id="format-lbl">Format:</legend>
							<select id="epub-format" aria-labelledby="format-lbl">
								<option value="3"> EPUB 3</option>
								<option value="2"> EPUB 2</option>
							</select>
						</fieldset>
						
						<label class="data"><span>Title:<img src="images/asterisk.png" alt="required"/></span> <input type="text" id="title" aria-required="true"/></label>
						<label class="data"><span>Author(s):</span> <input type="text" id="creator"/></label>
						<label class="data"><span>Identifier:</span> <input type="text" id="identifier"/></label>
						<label class="data"><span>Publisher:</span> <input type="text" id="publisher"/></label>
						<label class="data"><span>Date Published:</span> <input type="text" id="date"/></label>
						<div class="combo">
							<label><span>Last Modified:<img src="images/asterisk.png" alt="required"/></span> <input type="text" id="modified"/></label>
							<label><input type="button" id="add-timestamp" value="Set to now"/></label>
						</div>
						<label class="data"><span>Subject:</span> <input type="text" id="subject"/></label>
						<label class="data"><span>Description:</span> <input type="text" id="description"/></label>
						<label class="data"><span>Additional Metadata:</span> <textarea rows="8" aria-describedby="meta-input-desc" id="optional-meta" placeholder="label: value"></textarea></label>
						<div id="meta-input-desc" hidden="hidden">Use a colon followed by a space to separate the label from the value. Separate metadata items with a return character.</div>
					</div>
				</section>
				
				<section id="conformance" class="js-tabcontent">
					<h2>Conformance Verification</h2>
					
					<p class="help"><a href="user-guide/conformance.html" target="_blank">Need help?</a></p>
					
					<div class="form-data conf-control w85">
						<fieldset class="flat row">
							<legend id="espec-lbl">EPUB Accessibility:</legend>
							<select id="epub-a11y" aria-labelledby="espec-lbl">
								<option>1.0</option>
								<option selected="">1.1</option>
							</select>
						</fieldset>
						
						<fieldset class="flat row">
							<legend id="wspec-lbl">WCAG:</legend>
							<select id="wcag-version" aria-labelledby="wspec-lbl">
								<option>2.0</option>
								<option selected="">2.1</option>
								<option>2.2</option>
							</select>
						</fieldset>
						
						<fieldset class="flat row">
							<legend id="conf-lbl">Conformance:</legend>
							<select id="wcag-level" aria-labelledby="conf-lbl">
								<option value="a">Level A</label>
								<option value="aa" selected="">Level AA</label>
							</select>
						</fieldset>
						
						<div id="additional-opt">
							<a href="#additional-opt" onclick="smartConformance.showOptions(); return false;">Additional Options</a>
						</div>
					</div>
					
					<section id="conformance-options" aria-label="Additional Options" title="Additional Options">
						<div class="form-data conf-control">
							<fieldset id="exclusions" class="flat row">
								<legend>Exclude tests for:</legend>
								<label><input type="checkbox" id="excl-img" value="img" class="excl-test"/> Images</label>
								<label><input type="checkbox" id="excl-audio" value="audio" class="excl-test"/> Audio</label>
								<label><input type="checkbox" id="excl-video" value="video" class="excl-test"/> Video</label>
								<label><input type="checkbox" id="excl-script" value="script" class="excl-test"/> Scripting</label>
							</fieldset>
							
							<fieldset class="flat row">
								<legend>Show optional criteria:</legend>
								<label><input type="checkbox" id="show-aa" class="optional-criteria" disabled="disabled"/> Level AA</label>
								<label><input type="checkbox" id="show-aaa" class="optional-criteria"/> Level AAA</label>
							</fieldset>
							
							<fieldset id="hide-status" class="flat row">
								<legend>Hide success criteria with status:</legend>
								<label><input type="checkbox" class="hide_sc" value="unverified"/> Unverified</label>
								<label><input type="checkbox" class="hide_sc" value="pass"/> Pass</label>
								<label><input type="checkbox" class="hide_sc" value="fail"/> Fail</label>
								<label><input type="checkbox" class="hide_sc" value="na"/> N/A</label>
							</fieldset>
							
							<fieldset class="flat row">
								<legend>Set all success criteria to:</legend>
								<a id="set-sc-unv" href="#set-sc-unv" onclick="smartConformance.setGlobalSCStatus('unverified',false); return false">Unverified</a>
								<a id="set-sc-pass" href="#set-sc-pass" onclick="smartConformance.setGlobalSCStatus('pass',false); return false">Pass</a>
								<a id="set-sc-fail" href="#set-sc-fail" onclick="smartConformance.setGlobalSCStatus('fail',false); return false">Fail</a>
								<a id="set-sc-na" href="#set-sc-na" onclick="smartConformance.setGlobalSCStatus('na',false); return false">N/A</a>
							</fieldset>
							
							<fieldset class="flat row">
								<legend>Success criteria descriptions:</legend>
								<a id="set-desc-exp" href="#set-desc-exp" onclick="smartConformance.showSCBody(true); return false">Expand all</a>
								<a id="set-desc-col" href="#set-desc-col" onclick="smartConformance.showSCBody(false); return false">Collapse all</a>
							</fieldset>
						</div>
					</section>
					
					<section id="fallbacks" class="warning">
						<h3>Warning</h3>
						
						<p>The following EPUB-specific features were detected in the publication:</p>
						
						<ul id="fallback-types">
							<li class="manifest">The use of the <code>fallback</code> attribute in the package document (manifest fallbacks)</li>
							<li class="bindings">The use of the <code>bindings</code> element for media type-specific fallbacks in the package document</li>
							<li class="epub-switch">The use of the <code>epub:switch</code> element to provide fallbacks in content documents</li>
							<li class="epub-trigger">The use of the <code>epub:trigger</code> element for audio/video control</li>
						</ul>
						
						<p>These features are not broadly supported and do not meet the WCAG requirements for an accessible technology. You must verify
							that the accessibility of the publication is not dependent on support for these. If so, fail the pubication on any success
							criteria that are breached.</p>
						
						<p>Examples of how these features are used in inaccessible ways include:</p>
						
						<ul>
							<li class="manifest">Including images in the spine and using manifest fallbacks to provide an XHTML alternative (fails SC 1.1.1)</li>
							<li class="manifest">Including an inaccessible scripted XHTML document in the spine and using a manifest fallback to provide an accessible version (fails SC 2.1.1, 4.1.2 and potentialy others depending on what makes the default document inaccessible)</li>
							<li class="bindings">Adding an unsupported file type and using bindings to provide an accessible fallback (fails SC 1.1.1)</li>
							<li class="epub-switch">Replacing images with MathML markup using the <code>epub:switch</code> element (fails SC 1.1.1 if the image doesn't provide alt text or a description for the math in the image)</li>
							<li class="epub-trigger">Disabling the native controls on the audio and video elements by default to use triggers (fails SC 2.1.1. for lack of keyboard access)</li>
						</ul>
					</section>
					
					<!-- filter SC by content type -->
					<fieldset class="filter">
						<label id="filter-lbl">Filter success criteria to check: </span>
						<select id="filterSC" aria-labelledby="filter-lbl">
							<option value="all" selected="">All content</option>
							<option value="audio">Audio</option>
							<option value="color">Color</option>
							<option value="hd">Headings</option>
							<option value="img">Images</option>
							<option value="imgtext">Images of text</option>
							<option value="input">Input fields (textboxes, radio, checkboxes, etc.)</option>
							<option value="links">Links</option>
							<option value="lang">Language</option>
							<option value="mo">Media Overlays</option>
							<option value="page">Pagination</option>
							<option value="readorder">Reading Order</option>
							<option value="struct">Structure (tables, lists, etc.)</option> 
							<option value="text">Text</option>
							<option value="titles">Titles</option>
							<option value="controls">User controls (buttons, etc.)</option>
							<option value="video">Video</option>
						</select>
					</fieldset>
					
					<aside id="stats">
						<h4>Stats</h4>
						<ul>
							<li><span class="statLabel">Pass:</span> <span id="passCount" class="statCount"></span></li>
							<li><span class="statLabel">Fail:</span> <span id="failCount" class="statCount"></span></li>
							<li><span class="statLabel">N/A:</span> <span id="naCount" class="statCount"></span></li>
							<li><span class="statLabel">Unverified:</span> <span id="unverifiedCount" class="statCount"></span></li>
							<li><span class="statLabel">Obsolete:</span> <span id="obsCount" class="statCount"></span></li>
						</ul>
					</aside>
					
					<!-- SC dynamically inserted -->
					<?php $sc->generate() ?>
				</section>
				
				<?php $ext->add_tab_includes() ?>
				
				<section id="discovery" class="js-tabcontent">
					<h2>Discovery Metadata</h2>
					
					<p class="help"><a href="user-guide/discovery.html" target="_blank">Need help?</a></p>
					
					<div class="meta-wiz"><input tyoe="button" id="wiz-button" value="Run Metadata Wizard" onclick="showMetaWizard()"></div>
					
					<script>
						function showMetaWizard() {
							if (meta_wiz_dialog) {
								meta_wiz_dialog.dialog('open');
								smartMetaWizard.metaWizardInit();
							}
						}
					</script>
					
					<div id="discovery-fields"></div>
					
					<div class="buttons">
						<input type="button" class="button_hlt" id="discovery_button" value="Generate"/>
					</div>
					
					<section id="discovery-meta" aria-label="Discovery Metadata" title="Discovery Metadata">
						<p>Copy and paste the following metadata to the EPUB package document.</p>
						<textarea id="discovery-metadata" rows="15" aria-label="discovery metadata"></textarea>
						<button id="discovery-copy">Copy</button>
					</section>
				</section>

				<section id="distribution" class="js-tabcontent">
					<h2>Distribution Metadata</h2>
					
					<p class="help"><a href="user-guide/distribution.html" target="_blank">Need help?</a></p>
					
					<div id="distribution-fields"></div>
					
					<div class="buttons">
						<input type="button" class="button_hlt" id="distribution_button" value="Generate"/>
					</div>
					
					<section id="distribution-meta" aria-label="ONIX Metadata" title="ONIX Metadata">
						<p>Copy and paste the following metadata to the ONIX record.</p>
						<textarea id="distribution-metadata" rows="15" aria-label="distribution metadata"></textarea>
						<button id="distribution-copy">Copy</button>
					</section>
				</section>
				
				<section id="evaluation" class="js-tabcontent">
					<h2>Evaluation Result</h2>
					
					<p class="help"><a href="user-guide/evaluation.html" target="_blank">Need help?</a></p>
					
					<div class="conformance-result">
						<span class="hd">Conformance Result:</strong>
						<span id="conformance-result-status">Incomplete</span>
						<input type="hidden" name="conformance-result" id="conformance-result" value="incomplete"/>
					</div>
					
					<div id="extension-results"></div>
					
					<fieldset id="eval-info" aria-labelledby="ei-legend">
						<legend id="ei-legend" hidden="hidden">Evaluation Info</legend>
						<label class="data"><span>Evaluator:<img src="/images/asterisk.png" alt="required"/></span> <input type="text" id="certifiedBy" aria-required="true"/></label>
						<label class="data"><span>Credential:</span> <input type="text" id="certifierCredential"/></label>
						<label class="data"><span>Link to report:</span> <input type="text" id="certifierReport"/></label>
					</fieldset>
					
					<div class="buttons">
						<input type="button" class="button_hlt" value="Generate" id="generate-evaluation-metadata"/>
					</div>
					
					<section id="evaluation-meta" aria-label="Evaluation Metadata" title="Evaluation Metadata">
						<p>Copy and paste the following metadata to the EPUB package document.</p>
						<textarea id="evaluation-metadata" rows="6" aria-label="evaluation metadata"></textarea>
						<button id="evaluation-copy">Copy</button>
					</section>
				</section>
				
				<section id="generate" class="js-tabcontent">
					<h2>Generate Report</h2>
					
					<p class="help"><a href="user-guide/generate.html" target="_blank">Need help?</a></p>
					
					<div id="output-opt">
							<a href="#output-opt" onclick="smartReport.showOptions(); return false;">Output Options</a>
						</div>
					</div>
					
					<section id="output-options" aria-label="Output Options" title="Output Options">
						<div class="form-data conf-control">
							<fieldset>
								<legend>Conformance Notes</legend>
								<label class="data"><input type="radio" name="show-notes" value="all" checked="checked"/> Include all</label>
								<label class="data"><input type="radio" name="show-notes" value="failures"/> Only failure descriptions</label>
								<label class="data"><input type="radio" name="show-notes" value="notes"/> Only notes</label>
								<label class="data"><input type="radio" name="show-notes" value="none"/> None</label>
							</fieldset>
							
							<?php $ext->add_output_options() ?>
						</div>
					</section>
					
					<div class="buttons">
						<input type="button" value="Preview" id="preview-report" class="button_hlt preview" aria-describedby="popup-instructions"/>
						<input type="button" class="button_hlt" value="Create" id="generate-report" aria-describedby="gen"/>
					</div>
					
					<div id="popup-instructions">
						<p class="instr">Ensure that you do not have a pop-up blocker enabled when previewing content.</p>
						<p class="instr">Do not bookmark the preview page as the report is lost once your browser is closed.</p>
					</div>
				</section>
			</form>
		</main>
		
		<div id="save" aria-label="Save report" title="Save report">
			<p>Select where to save the report:<p>
			<fieldset>
				<div><label><input type="radio" name="location" value="remote" checked="checked"/> Ace SMART server</div>
				<div><label><input type="radio" name="location" value="local"/> Local file system</div>
			</fieldset>
		</div>
		
		<div id="import" aria-label="Ace Import Details" title="Ace Import Details">
		
		</div>
		
		<form>
			<section id="error-pane" role="region" aria-labelledby="validation-msg">
				<a href="#error-pane-close" id="error-pane-close"><img src="images/close-icon.png" alt="Close" class="error-close"/></a>
				<h2 id="validation-msg">Validation Messages:</h2>
				<div role="log" aria-labelledby="validation-msg" class="scroll">
					<ul id="error-msg"></ul>
				</div>
			</section>
		</form>
		
		<?php include 'php/meta-wizard.php' ?>
		
		<?php $ext->print_scripts(); ?>
	</body>
</html>
