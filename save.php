<?php require_once 'php/db.php' ?>
<?php

	if (!isset($_POST['location'])) {
		echo '{"error": "Unknown save location. Please try again."}';
		die();
	}
	
	if (!isset($_POST['u']) || !isset($_POST['id'])) {
		echo '{ "error": "Invalid user information. Please try again." }';
		die();
	}
	
	if (!isset($_POST['shared']) || !$_POST['shared']) {
	
		$now = gmdate("Y-m-d H:i:s");
		$status = ($_POST['location'] == 'db') ? 'remote' : 'local';
		$evaluation = '';
		
		$db = new SMART_DB();
		
		if (!$db->connect()) {
			echo '{ "error": "Save functionality is currently unavailable. Please try again." }';
			die();
		}
		
		if (!$db->prepare("UPDATE evaluations SET modified = ?, status = ?, evaluation = ? WHERE username = ? AND id = ?")) {
			echo '{ "error": "Failed to save evaluation. Please try again." }';
			die();
		}
	
		if ($_POST['location'] == 'db') {
			
			if (!isset($_POST['evaluation'])) {
				echo '{ "error": "Invalid evaluation. Please try again." }';
				die();
			}
			
			$evaluation = $_POST['evaluation'];
		}
		
		if (!$db->bind_param("ssssi", array($now, $status, $evaluation, $_POST['u'], $_POST['id']))) {
			echo '{ "error": "An error occurred while preparing to save evaluation. Please try again." }';
			die();
		}
		
	    if (!$db->execute()) {
			echo '{ "error": "An error occurred saving the evaluation. Please try again." }';
			die();
	    }
	    
	    $db->close();
		
	}
	
	if ($_POST['location'] == 'db') {
		echo '{ "status": "Evaluation successfully saved." }';
	}
	
	else {
		
		$title = $_POST['t'] ? $_POST['t'] : 'ace-smart-evaluation';
		
		$dateTime = new DateTime();
		$title .= '-' . $dateTime->format('Ymd') . '.json';
		
		header('Content-Disposition: attachment; filename="' . $title . '"');
		header('Content-Type: application/json');
		# header('Content-Length: ' . strlen($_POST['evaluation']));
		header('Connection: close');
		
		echo $_POST['evaluation'];
	}
	
?>