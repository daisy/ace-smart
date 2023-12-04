<?php require_once 'users/init.php' ?>
<?php require_once 'php/version.php' ?>
<?php if (!securePage($_SERVER['PHP_SELF'])) { die(); } ?>

<?php require_once 'php/db.php' ?>

<html>
<head>
	<meta charset="utf-8"/>
	<title>Account Delete Request - Ace SMART</title>
	<link rel="stylesheet" type="text/css" href="css/a11y.css<?= '?v=' . $smart_version ?>"/>
	<link rel="stylesheet" type="text/css" href="css/tabs.css<?= '?v=' . $smart_version ?>"/>
	<style>
		section {
			padding: 2rem;
		}
	</style>
</head>
<body>
	<header>
		<h1><span property="dcterms:publisher"><img class="logo" src="images/daisy_logo.png" alt="DAISY Consortium"/></span> <span property="dcterms:title">Ace <span class="smart_hd">SMART</span></span></h1>
	</header>
	
	<main>
		<section>
			<h2>Account Delete Request</h2>
<?php
if(!empty($_POST)) {
	if(!empty($_POST['delete_user'])){
	
		$db = new SMART_DB();
		
		if (!$db->connect()) {
			echo '<p>Account deleting is not currently available. Please try again later.</p>';
			die();
		}
		
		// first remove the evaluation history in case anything goes wrong deleting the account
		
		if (!$db->prepare("DELETE FROM evaluations WHERE username = ?")) {
			echo '<p>An error occurred deleting your evaluation history. Please try again.</p>';
			die();
		}
		
		
		if (!$db->bind_param("s", array($user->data()->username))) {
			echo '<p>An error occurred removing your evaluation history. Please try again. ' . $user->data()->username . '</p>';
			die();
		}
		
		$db->execute();
		
		// next remove the user account
		
		if (!$db->prepare("DELETE FROM users WHERE id = ?")) {
			echo '<p>An error occurred deleting your account. Please try again.</p>';
			die();
		}
		
		if (!$db->bind_param("i", array($user->data()->id))) {
			echo '<p>An error occurred removing your account. Please try again.</p>';
			die();
		}
	    
	    $db->execute();
	    $db->close();

		echo '<p>Your account has been successfully deleted. Thank you for trying Ace SMART!</p>';
	}
	
	else {
		echo '<p>Invalid request. Account deletion requests can only be made from your account profile page.</p>';
	}
}

else {
	echo '<p>Invalid request. This page can only be accessed by an authorized user.</p>';
}
?>
	
		</section>
	</main>
		
	<footer>
		<p>Copyright &#169; <span property="dcterms:dateCopyrighted">2017</span> <a target="_blank" href="http://daisy.org">DAISY Consortium</a>. All Rights Reserved.</p>
		<p><a target="_blank" href="http://www.github.com/DAISY/ace-smart-src/issues">Report a problem</a> | <a target="_blank" href="http://www.daisy.org/terms-use">Terms of Use</a></p>
	</footer>
</body>
</html>
