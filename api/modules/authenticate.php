<?php

	require_once __DIR__ . '/../../php/db.php';
	require_once 'util.php';
	
	class SMART_AUTH {
	
		private $username = NULL;
		private $password = NULL;
		private $auth_str = NULL;
		
		function __construct($arg) {
			
			$this->auth_str = isset($arg['auth_str']) ? $arg['auth_str'] : $this->auth_str;
			
			if (!$this->auth_str) {
				abort('Basic authentication credentials not provided', 401);
			}
			
			// username and password are passed in authorization basic header
			
			list($this->username, $this->password) = explode(':' , base64_decode(substr($this->auth_str, 6)));
			
			if (!isset($this->username)) {
				abort('Username not provided', 401);
			}
			
			if (!isset($this->password)) {
				abort('Password identifier not provided', 401);
			}
			
		}
		
		public function get_username() {
			return $this->username;
		}
		
		public function verify() {
		
			$db = new SMART_DB();
			
			if (!$db->connect()) {
				abort('Database not available', 500);
			}
			
			if (!$db->prepare("SELECT password FROM users WHERE username = ?")) {
				abort('Unable to confirm user identity (prepare)', 500);
			}
			
			if (!$db->bind_param("s", array($this->username))) {
				abort('Unable to confirm user identity (bind)', 500);
			}
			
			if (!$db->execute()) {
				abort('Unable to confirm user identity (execute)', 500);
			}
			
			$result = $db->get_result();
			
			if (!password_verify($this->password, $result['password'])) {
				abort('Invalid password provided or user does not exist.', 401);
			}
		}
	}

?>
