<?php require_once 'users/init.php' ?>
<?php require_once 'php/version.php' ?>

<?php if (!securePage($_SERVER['PHP_SELF'])) { die(); } ?>

<?php include 'php/evaluations.php' ?>
<?php
	$eval = new SMART_EVALUATION(array(
		'username' => $user->data()->username,
		'company' => $user->data()->company,
		'shared' => $user->data()->shared,
		'license' => $user->data()->license,
		'id' => isset($_POST['id']) ? $_POST['id'] : 0
	));
	
	$eval->check_license();
?>

<!DOCTYPE html>
<html lang="en" prefix="dcterms: http://purl.org/dc/terms/ schema: http://schema.org/" typeof="schema:WebPage">
	<head>
		<meta charset="utf-8"/>
		<title>Ace SMART</title>
		<link rel="stylesheet" href="https://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />		
		<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"/>
		<link rel="stylesheet" type="text/css" href="css/a11y.css<?= '?v=' . $smart_version ?>"/>
		<link rel="stylesheet" type="text/css" href="css/tabs.css<?= '?v=' . $smart_version ?>"/>
		<link rel="stylesheet" type="text/css" href="css/drag-drop.css<?= '?v=' . $smart_version ?>"/>
    	<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.12.1/css/jquery.dataTables.min.css"/>
    	<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/responsive/2.3.0/css/responsive.dataTables.min.css"/>
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
		
		<script>
			var smart_lang = 'en';
			var smart_locale = 'en-us';
		</script>
		
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
		<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
		
		<!-- DataTables -->
		<script type="text/javascript" src="https://cdn.datatables.net/1.12.1/js/jquery.dataTables.min.js"></script>
		<script type="text/javascript" src="https://cdn.datatables.net/responsive/2.3.0/js/dataTables.responsive.min.js"></script>
		<script type="text/javascript" src="js/init-datatables.js<?= '?v=' . $smart_version ?>"></script>
		<script type="text/javascript" src="js/js.cookie.js<?= '?v=' . $smart_version ?>"></script>
		
		<!-- messages -->
		<script src="js/config/messages.js<?= '?v=' . $smart_version ?>"></script>
		
		<?php
			if (isset($_POST['action'])) {
				if ($_POST['action'] == 'delete') {
					if (!$eval->delete_evaluation()) {
						echo '<script>alert(smart_errors.en.delfail);</script>';
					}
				}
				
				else if ($_POST['action'] == 'fulldelete') {
					if (!$eval->delete_record()) {
						echo '<script>alert(smart_errors.en.recfail);</script>';
					}
				}
			}
		?>
		
		<script src="js/drag-drop.js<?= '?v=' . $smart_version ?>" defer></script>
		<script src="js/init-index.js<?= '?v=' . $smart_version ?>" defer></script>
	</head>
	
	<body>
		<header>
			<div class="id"><span class="super">You are logged in as <code><a target="_blank" href="users/account.php"><?php echo $user->data()->username; ?></a></code></span> <a class="logout" href="users/logout.php"><img src="images/logout.png" alt="log out" title="Log out" onmouseover="this.src='images/logout_hover.png'" onmouseout="this.src='images/logout.png'"></a></div>
			
			<h1><img src="images/daisy_high.jpg" class="logo" alt="DAISY"/> <span property="dcterms:title">Ace <span class="smart_hd">SMART</span></span></h1>
			
			<div class="menubar"></div>
			
			<?php include 'php/sponsor.php' ?>
		</header>
		
		<main class="start">
			<section id="load">
				<h2 class="welcome">Start an Evaluation</h2>
				
				<?php $eval->add_evaluation_form() ?>
			</section>
			
			<section id="history"<?php if ($user->data()->shared) { echo ' hidden=""'; } ?>>
				<h2 class="welcome">Evaluation History</h2>
				
				<table id="evaluations" class="table responsive table-striped table-bordered">
					<thead>
						<tr>
							<th data-priority="1">Title</th>
							<th>Started</th>
							<th data-priority="4">Last Saved</th>
							<th data-priority="3">Status</th>
							<th data-priority="2">Options</th>
						</tr>
					</thead>
					<tbody>
						<?php $eval->list_evaluations(); ?>
					</tbody>
				</table>
				<?php $eval->allow_full_delete(); ?>
				<p><small>All times are in UTC.</small><p>
			</section>
		</main>
		
		<div id="import" aria-label="Resume from locally saved file" title="Resume from locally saved file">
			<input type="file" name="local-eval" id="local-eval"/>
		</div>
		
		<div id="error" aria-label="Error" title="Error">
			<p id="error-msg"></p>
		</div>
		
		<footer>
			<p><a target="_blank" href="http://www.github.com/daisy/ace-smart/issues">Report a problem</a> | 
				<a target="_blank" href="http://www.daisy.org/terms-use">Terms of Use</a> | 
				<a target="_blank" href="attribution.html">Attribution</a> | 
				<a href="user-guide/" target="_blank">User Guide</a> | 
				<a href="faq.html" target="_blank">FAQ</a> | 
				<a href="new.html" target="_blank">What's New</a></p>
			<p>Copyright &#169; <span property="dcterms:dateCopyrighted">2022</span> <a target="_blank" href="http://daisy.org"><span property="dcterms:publisher">DAISY</span> Consortium</a>. All Rights Reserved.</p>
		</footer>
	</body>
</html>
