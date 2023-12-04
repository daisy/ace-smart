<?php require_once 'php/version.php' ?>

<?php

	$html = <<<HTML
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>{$_POST['title']}</title>
		<meta charset="utf-8"/>
    	<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.12.1/css/jquery.dataTables.min.css"/>
    	<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/responsive/2.3.0/css/responsive.dataTables.min.css"/>
		<link rel="stylesheet" type="text/css" href="https://{$_SERVER["HTTP_HOST"]}/css/report.css?v={$smart_version}"/>
HTML;

	if ($_POST['modules']) {
		foreach (explode(',', $_POST['modules']) as $module) {
			$html .= '<link rel="stylesheet" type="text/css" href="https://' . $_SERVER["HTTP_HOST"] . '/extensions/' . $module . '/css/report.css?v=' . $smart_version . '"/>';
		}
	}
	
	$html .= <<<HTML
		<link rel="stylesheet" type="text/css" href="https://{$_SERVER["HTTP_HOST"]}/css/tabs.css?v={$smart_version}"/>
		<meta name="viewport" content="width=device-width, initial-scale=1"/>
		<script>
			var smart_lang = 'en';
			var smart_locale = 'en-us';
		</script>
	</head>
	<body typeof="Book" vocab="https://schema.org">
		<header>
			<h1>EPUB Accessibility Conformance Report</h1>
			<div id="add-logo">{$_POST['logo']}</div>
		</header>
		
		<main class="js-tabs">{$_POST['report']}</main>
		
		<footer>
			<p id="timestamp">Generated <span id="date-created">{$_POST['timestamp']}</span> using <a href="https://smart.daisy.org">Ace SMART</a></p>
			<p><a href="https://daisy.org"><img src="https://smart.daisy.org/images/daisy_logo.gif" alt="DAISY"/></a></p>
		</footer>
		<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
		<script type="text/javascript" src="https://cdn.datatables.net/1.12.1/js/jquery.dataTables.min.js"></script>
		<script type="text/javascript" src="https://cdn.datatables.net/responsive/2.3.0/js/dataTables.responsive.min.js"></script>
		<script type="text/javascript" src="https://{$_SERVER["HTTP_HOST"]}/js/config/messages.js?v={$smart_version}"></script>
		<script type="text/javascript" src="https://{$_SERVER["HTTP_HOST"]}/js/init-datatables.js?v={$smart_version}>"></script>
		<script>
			var dt = new DT();
			
			$(document).ready(function() {
				dt.initialize({
					'paging': false,
					'info': false,
					'searchable': false
				});
			});
		</script>
		<script src="https://{$_SERVER["HTTP_HOST"]}/js/a11ytabs.js?v={$smart_version}"></script>
	</body>
</html>
HTML;

	if (!isset($_POST['preview']) || empty($_POST['preview'])) {
		header('Content-Disposition: attachment; filename="ace-smart-report.html"');
		header('Content-Type: text/html');
		header('Content-Length: ' . strlen($html));
		header('Connection: close');
	}
	
	echo $html;

?>
