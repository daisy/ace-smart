<?php

	// common response headers for apis
	header("Content-Type: application/json; charset=UTF-8");
	header("Access-Control-Allow-Methods: GET,OPTIONS");
	header("Access-Control-Allow-Headers: Authorization");
	header("Access-Control-Max-Age: 600");
	
	// ignore options calls to see if an api is available
	if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
		http_response_code(200);
		exit();
	}

?>