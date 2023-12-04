<?php
	
	function abort($msg, $http_code) {
		http_response_code($http_code);
		echo '{"error": "' . $msg . '"}';
		exit();
	}

?>
