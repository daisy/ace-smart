<?php
	
	require_once __DIR__ . '/../../php/db.php';
	require_once 'util.php';
	
	class SMART_VERIFICATION {
	
		private $pubid = 0;
		private $username = NULL;
		
		function __construct($arg) {
		
			$this->pubid = isset($arg['pubid']) ? trim($arg['pubid']) : '';
			
			if (!$this->pubid) {
				abort('Publication identifier not provided', 400);
			}
			
			$this->username = $arg['username'];
		
		}
		
		public function has_evaluation() {
		
			$db = new SMART_DB();
			
			if (!$db->connect()) {
				abort('Database not available', 500);
			}
			
			if (!$db->prepare("SELECT uid FROM evaluations WHERE username = ? AND uid = ?")) {
				abort('Unable to verify evaluation (prepare)', 500);
			}
			
			if (!$db->bind_param("ss", array($this->username, $this->pubid))) {
				abort('Unable to verify evaluation (bind)', 500);
			}
			
			if (!$db->execute()) {
				abort('Unable to verify evaluation (execute)', 500);
			}
			
			$result = $db->get_result();
			
			if (isset($result['uid'])) {
				http_response_code(200);
				echo '{"exists": true}';
			}
			
			else {
				http_response_code(204);
				echo '{"exists": false}';
			}
		}
	}

?>