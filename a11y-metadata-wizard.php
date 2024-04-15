<!DOCTYPE html>
<?php require_once 'php/version.php' ?>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>DAISY SMART &#8212; Accessibility Metadata Wizard</title>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" type="text/css" href="css/a11y.css<?= '?v=' . $smart_version ?>">
		<link rel="stylesheet" type="text/css" href="css/a11y-meta-wizard.css<?= '?v=' . $smart_version ?>">
		<style>
			body {
				background: rgb(225,225,225);
				font-family: arial, helvetica, sans-serif;
			}
		</style>
	</head>
	<body>
		<header>
			<h1><img src="images/daisy_logo.png" class="logo" alt="DAISY"> <span property="dcterms:title">Ace <span class="smart_hd">SMART</span> &#8212; Accessibility Metadata Wizard</span></h1>
			<div class="menubar"></div>
		</header>
		<?php include './php/meta-wizard.php' ?>
		<script src="js/format.js<?= '?v=' . $smart_version ?>"></script>
	</body>
</html>