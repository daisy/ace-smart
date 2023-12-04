<?php

	require_once 'modules/headers.php';

	require_once 'modules/authenticate.php';
	require_once 'modules/retrieval.php';
	
	// verify the request comes from an authorized user
	$auth = new SMART_AUTH(array(
		'auth_str' => $_SERVER['HTTP_AUTHORIZATION']
	));
	$auth->verify();
	
	// retrieve and return the requested evaluation
	$retrieve = new SMART_RETRIEVE(array(
		'username' => $auth->get_username(),
		'pubid' => $_GET['pubid']
	));
	$retrieve->get_evaluation();

?>