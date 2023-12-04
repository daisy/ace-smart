
<?php 

	/*
	 * Encapsultes database functions to simplify catching and handling of errors
	 */
	
	class SMART_DB {
	
		private $mysqli = NULL;
		private $stmt = NULL;
		
		public function connect() {
			if ($this->mysqli && $this->mysqli->ping()) { return true; }
			// username, password and database are stored as server environment variables for security
			// and so file can be deployed without having to modify the connection db each time
			return ($this->mysqli = new mysqli("localhost",  $_SERVER['DB_USER'],  $_SERVER['DB_PASS'], $_SERVER['DB'])) ? true : false;
		}
		
		public function prepare($sql) {
			if (!$this->mysqli || !$this->mysqli->ping()) { return false; }
			if ($this->stmt) { $this->stmt->close(); }
			return ($this->stmt = $this->mysqli->prepare($sql)) ? true : false;
		}
		
		public function bind_param($types, $params) {
			if (!$this->stmt) { return false; }
			array_unshift($params, $types);
			$args = array();
			foreach ($params as $key => $value) $args[$key] = &$params[$key];
			return (call_user_func_array(array($this->stmt, 'bind_param'), $args)) ? true : false;
		}
		
		public function execute() {
			if (!$this->stmt) { return false; }
			return ($this->stmt->execute()) ? true : false;
		}
		
		public function get_result() {
			if (!$this->stmt) { return ''; }
			$result = $this->stmt->get_result();
			return $result->fetch_assoc();
		}
		
		public function get_results() {
			if (!$this->stmt) { return array(); }
			$result = $this->stmt->get_result();
			$rows = array();
			while($row = $result->fetch_assoc()) {
				$rows[] = $row;
			}
			return $rows;
		}
		
		public function close() {
			if (!$this->stmt) { return; }
			$this->stmt->close();
			$this->stmt = NULL;
		}
		
		public function insert_id() {
			if (!$this->mysqli) { return ''; }
			return $this->mysqli->insert_id;
		}
		
		function __destruct() {
			if ($this->mysqli) {
				$this->mysqli->close();
			}
		}
	}

?>