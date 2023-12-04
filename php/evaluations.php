
<?php require_once 'db.php' ?>

<?php
	
	class SMART_EVALUATION {
	
		private $username = '';
		private $company = '';
		private $shared = false;
		private $license = '';
		private $action = '';
		private $title = '';
		private $pub_id = 0;
		private $eval_id = 0;
		private $eval_max = 0;
		private $eval_remaining = 0;
		private $db = '';
		private $to_save = false;
		
		function __construct($arg) {
			
			$this->username = $arg['username'];
			$this->company = isset($arg['company']) ? $arg['company'] : '';
			$this->shared = isset($arg['shared']) && $arg['shared'] == 1 ? true : false;
			$this->license = isset($arg['license']) ? $arg['license'] : '';
			
			$this->action = isset($arg['action']) ? $arg['action'] : '';
			$this->title = isset($arg['title']) ? $arg['title'] : '';
			$this->pub_id = isset($arg['pubid']) ? $arg['pubid'] : 0;
			$this->eval_id = isset($arg['id']) ? $arg['id'] : 0;
			
			$this->db = new SMART_DB();
			$this->db->connect();
		}
		
		
		/*
		 * Check that the user is licensed
		 * - has to have the value 'unlimited' or 'max#' where # is the number of evaluation per month allowed
		 */
		
		public function check_license() {
		
			if (!$this->license) {
				die();
			}
			
			$is_licensed = false;
			
			if ($this->license == 'unlimited') {
				$is_licensed = true;
			}
			
			else {
		    	$this->eval_max = str_replace('max','',$this->license);
				
				if (is_numeric($this->eval_max) && $this->eval_max > 0) {
					$is_licensed = true;
				}
			}
			
			if (!$is_licensed) {
				die();
			}
		}
		
		
		/*
		 * Checks if the user has already exceeded their monthly alloted number of evaluations
		 */
		
		private function check_remaining_evaluations() {
		
			$this_month = gmdate('Y-m-01') . ' 00:00:00';
			
			$sql = 'SELECT COUNT(title) AS eval_count FROM evaluations ';
			
			$arg = '';
			
			if ($this->company) {
				$arg = $this->company;
				$sql .= 'WHERE company = ?';
			}
			
			else {
				$arg = $this->username;
				$sql .= 'WHERE username = ? AND company = ""';
			}
			
			$sql .= ' AND created >= ?';
			
			if ($this->db->prepare($sql)) {
				
				$this->db->bind_param('ss', array($arg, $this_month));
			    
			    $this->db->execute();
				
				$result = $this->db->get_result();
				
			    $this->eval_remaining = $this->eval_max - $result['eval_count'];
			    
			    $this->db->close();
			}
		}
		
		
		/*
		 * adds the ace report upload form to start a new evaluation
		 * otherwise displays a message that limit has been exceeded 
		 */
		
		public function add_evaluation_form() {
		
			if ($this->license != 'unlimited') {
				$this->check_remaining_evaluations();
			}
			
			if ($this->license != 'unlimited' && $this->eval_remaining == 0) {
				echo '<p class="overlimit">You have reached your evaluation limit for this month.</p>';
			}
			
			else {
			
				if ($this->license != 'unlimited') {
					echo '<p class="license">Note: Your license allows ' . $this->eval_remaining . ' more evaluation(s) this month.</p>';
				}
				
				echo <<<HTML
					<div class="container js">
					<form method="post" action="smart.php" enctype="multipart/form-data" novalidate="novalidate" class="box" id="nextStep">
						<div class="box__input">
							<input type="file" name="ace-report" id="file" class="box__file"/>
							<label class="dnd" for="file">
								<strong>Select an Ace report or locally saved evaluation</strong>
								<span class="box__dragndrop"> or drag one here</span>.<br/>
							</label>
							<p class="new-eval">Or <a id="new_eval" href="#new_eval">start a blank evaluation</a></p>
							<button type="submit" class="box__button">Load</button>
						</div>
						
						<div class="box__uploading">Uploading&#8230;</div>
						<div class="box__success">Done! <a href="" class="box__restart" role="button">Load a different report?</a></div>
						<div class="box__error">Error! <span></span>. <a href="" class="box__restart" role="button">Try again!</a></div>
						<input type="hidden" name="id" id="id" value=""/>
						<input type="hidden" name="action" id="action" value="load"/>
						<input type="hidden" name="title" id="title" value=""/>
					</form>
				</div>
HTML;
			}
		}
		
		public function allow_full_delete() {
			if ($this->license == 'unlimited') {
				echo '<input type="hidden" id="alert_full_delete" value="1"/>';
			}
		}
		
		/*
		 * generates the evaluation history table
		 */
		
		public function list_evaluations() {
		
			if ($this->shared) {
				return;
			}
			
			if ($this->db->prepare("SELECT id, title, created, modified, status FROM evaluations WHERE username = ? AND company = ? ORDER BY created DESC")) {
			
				if ($this->db->bind_param("ss", array($this->username, $this->company))) {
				
			    	if ($this->db->execute()) {
			    	
						$result = $this->db->get_results();
						
						foreach ($result as $row) {
							
							$status = '';
							$option = '';
							
							switch ($row['status']) { 
								case 'remote':
									$status = 'Saved';
									$option = <<<HTML
			<input type="image" src="images/resume.svg" height="40" id="resume_{$row['id']}" alt="Resume" title="Resume"/>
			<input type="image" src="images/delete.svg" height="40" id="delete_{$row['id']}" alt="Delete" title="Delete"/>
HTML;
								break;
								
								case 'local':
									$status = 'Saved Locally';
									$option = <<<HTML
			<input type="image" src="images/resume.svg" height="40" id="reload_{$row['id']}" alt="Resume" title="Resume"/>
			<input type="image" src="images/delete.svg" height="40" id="delete_{$row['id']}" alt="Delete" title="Delete"/>
HTML;
								break;
								
								case 'deleted':
									$status = 'Deleted';
									$option = '<input type="image" src="images/resume.svg" height="40" id="reload_' . $row['id'] . '" alt="Resume" title="Resume"/>';
								break;
								
								case 'unsaved':
									$status = 'Not Saved';
									$option = '<input type="image" src="images/delete.svg" height="40" id="delete_' . $row['id'] . '" alt="Delete" title="Delete"/>';
								break;
								
								default:
									$option = <<<HTML
			<input type="image" src="images/resume.svg" height="40" id="resume_{$row['id']}" alt="Resume" title="Resume"/>
			<input type="image" src="images/delete.svg" height="40" id="delete_{$row['id']}" alt="Delete" title="Delete"/>
HTML;

							}

							
							echo <<<HTML
	<tr>
		<td>{$row['title']}</td>
		<td>{$row['created']}</td>
		<td>{$row['modified']}</td>
		<td>{$status}</td>
		<td class="option">{$option}</td>
	</tr>
HTML;
						}
						
					    $this->db->close();
			    	}
				}
			}
		}
		
		
		/*
		 *
		 * handles all evaluation initiation attempts:
		 * - loading a new evaluation from an ace report
		 * - clicking the load new blank evaluation link
		 * - resuming an evaluation stored on the server
		 * - resuming a locally saved evaluation
		 *
		 */
		
		public function load_evaluation() {
				
			$evaluation = '';
			
			$now = gmdate("Y-m-d H:i:s");
			$modified = '0000-00-00 00:00:00';
			$status = 'unsaved';
			
			// action=new results from the user clicking the link to start a new blank evaluation
			if ($this->action == 'new') {
			
				if (!$this->title) {
					$this->abort('notitle');
				}
				
				$this->pub_id = $this->generate_uuid();
				
				// create a basic json structure to store the blank evaluation title so the next page has something to process
				$evaluation = '{ "category": "newEvaluation", "title": ' . json_encode($this->title) . ' }';
				
				$this->to_save = true;
				
				// create a default entry in the database
				if (!$this->db->prepare("INSERT INTO evaluations (username, company, uid, title, created, modified, status, evaluation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")) {
					$this->abort('newins');
				}
				
				if (!$this->db->bind_param("ssssssss", array($this->username, $this->company, $this->pub_id, $this->title, $now, $modified, $status, $evaluation))) {
					$this->abort('newbind');
				}
				
				if (!$this->db->execute()) {
					$this->abort('newexec');
				}
				
				$this->eval_id = $this->db->insert_id();
			}
			
			/* 
			 * action=load occurs when an ace report is uploaded
			 * action=reload occurs when the user uploads a locally saved evaluation
			 */
			
			else if ( 
					  ($this->action == 'load')
					  || ($this->action == 'autoload')
					  || ($this->action == 'reload' && $this->eval_id)
					  || ($this->action == 'reload' && $this->shared)
					 ) {
				
				// get the report/evaluation from uploaded file contents when available
				if ($_FILES['ace-report'] && $_FILES['ace-report']['error'] == UPLOAD_ERR_OK && is_uploaded_file($_FILES['ace-report']['tmp_name'])) {
					$evaluation = file_get_contents($_FILES['ace-report']['tmp_name']); 
				}
				
				// otherwise get the ace report from the autoload string
				else if ($_POST['ace-report']) {
					$evaluation = htmlspecialchars_decode($_POST['ace-report']); 
				}
				
				$json = json_decode($evaluation);
				
				// bail out if a file wasn't available or didn't contain json
				if (!$json) {
					$this->abort('nojson');
				}
				
				// reset the action if the uploaded file is a saved evaluation
				if ($this->action == 'load' && isset($json->{'category'}) && $json->{'category'} == 'savedEvaluation') {
				
					$this->action = 'reload';
					
					if ($json->{'id'} !== null && $json->{'id'} == 0) {
						// bug from shared accounts caused 0 ids - this re-adds an entry - can be removed in future
						if (!$this->db->prepare("INSERT INTO evaluations (username, company, uid, title, created, modified, status, evaluation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")) {
							$this->abort('evalins');
						}
						
						if (!$this->db->bind_param("ssssssss", array($this->username, $this->company, $json->{'publicationInfo'}->{'identifier'}, $json->{'publicationInfo'}->{'title'}, $now, $modified, 'local', ''))) {
							$this->abort('evalbind');
						}
						
						if (!$this->db->execute()) {
							$this->abort('evalexec');
						}
						
						$this->eval_id = $this->db->insert_id();
					}
					
					else {
						if (!$json->{'id'}) {
							$this->abort('noreloadid');
						}
						
						$this->eval_id = $json->{'id'};
						$this->verify_id();
					}
				}
				
				// verify that the uploaded json is an ace report using the @context (only checks the non-variable part of the url)
				if (($this->action == 'load' || $this->action == 'autoload') && (!$json->{'@context'} || strpos($json->{'@context'}, 'http://daisy.github.io/ace') === false)) {
					$this->abort('unknownload');
				}
				
				// verify that the uploaded json is a saved evaluation by checking the category property
				else if ($this->action == 'reload' && (!$json->{'category'} || $json->{'category'} != 'savedEvaluation')) {
					$this->abort('unknownreload');
				}
				
				// as ace reports represent a new evaluation, loading one additionally needs an entry added to the database to track/save the user's work
				if ($this->action == 'load' || $this->action == 'autoload') {
				
					$this->to_save = true;
					
					// first check is whether the user has already started an evaluation for a publication with the identifier in the ace report
					if (!$this->db->prepare("SELECT uid FROM evaluations WHERE username = ? AND uid = ?")) {
						$this->abort('uidselect');
					}
					
					if ($this->action != 'autoload' || strtolower($_POST['auto']) != 'lia') {
						// get the publication identifier from the ace report
						$this->pub_id = is_array($json->{'earl:testSubject'}->{'metadata'}->{'dc:identifier'}) ? $json->{'earl:testSubject'}->{'metadata'}->{'dc:identifier'}[0] : $json->{'earl:testSubject'}->{'metadata'}->{'dc:identifier'};
					}
					
					if (!$this->db->bind_param("ss", array($this->username, $this->pub_id))) {
						$this->abort('uidbind');
					}
					
					if (!$this->db->execute()) {
						$this->abort('uidexec');
					}
					
					$result = $this->db->get_result();
					
					$this->db->close();
					
					// if a matching uid is found, the ace json gets stored with the new entry so that the
					// user can be prompted to confirm they actually intended to start a new evaluation
					// - shared account do no go through this check to avoid users seeing any info about other evaluations
					
					$prompt_pub = ($result['uid'] && !$this->shared) ? true : false;
					
					$add_eval = $prompt_pub ? $evaluation : ''; 
					
					// next insert a new entry into the database for the publication
					if (!$this->db->prepare("INSERT INTO evaluations (username, company, uid, title, created, modified, status, evaluation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")) {
						$this->abort('evalins');
					}
					
					$title = is_array($json->{'earl:testSubject'}->{'metadata'}->{'dc:title'}) ? $json->{'earl:testSubject'}->{'metadata'}->{'dc:title'}[0] : $json->{'earl:testSubject'}->{'metadata'}->{'dc:title'};
					
					if (!$this->db->bind_param("ssssssss", array($this->username, $this->company, $this->pub_id, $title, $now, $modified, $status, $add_eval))) {
						$this->abort('evalbind');
					}
					
					if (!$this->db->execute()) {
						$this->abort('evalexec');
					}
					
					$this->eval_id = $this->db->insert_id();
					
					// now redirect the user to the confirmation page if there was a matching uid
					if ($prompt_pub) {
						header("Location: confirm.php?id=" . $this->eval_id . "&uid=" . $this->pub_id);
						die();
					}
				}
			}
			
			/* 
			 * action=resume occurs when an evaluation saved in the db is being restored
			 * action=okload occurs after the user confirms they want to load an evaluation with the same uid as another (see action=load)
			 */
			
			else if (($this->action == 'resume' && ($this->eval_id || $this->pub_id)) || $this->action == 'okload') {
				
				// get the stored json from the database
				$select_sql = "SELECT evaluation FROM evaluations WHERE username = ? AND " . ($this->eval_id ? "id = ?" : "uid = ?"); 
				if (!$this->db->prepare($select_sql)) {
					$this->abort('resselect');
				}
				
				if (!$this->db->bind_param("ss", array($this->username, ($this->eval_id ? $this->eval_id : $this->pub_id)))) {
					$this->abort('resbind');
				}
				
				if (!$this->db->execute()) {
					$this->abort('resexec');
				}
				
				$result = $this->db->get_result();
				
				$evaluation = $result['evaluation'];
				
				$this->db->close();
				
				if ($this->action == 'okload') {
					// with okload, the user hasn't ever saved the new evaluation (it was stored as part of action=load)
					// setting this to true will prompt them to save before they try to exit, if they haven't
					$this->to_save = true;
				}
			
			}
			
			else {
				$this->abort('noaction');
			}
			
			if ($evaluation == '') {
				$this->abort('noeval');
			}
			
			echo $evaluation;
		}
		
		
		// for saved evaluations uploaded through the drag/drop box, the ID in the evaluation
		// needs to be verified against the database to ensure a record is still there
		private function verify_id() {
			if (!$this->db->prepare('SELECT id FROM evaluations WHERE username = ? AND id = ?')) {
				$this->abort('idprep');
			}
			
			if (!$this->db->bind_param("si", array($this->username, $this->eval_id))) {
				$this->abort('idbind');
			}
			
			if (!$this->db->execute()) {
				$this->abort('idexec');
			}
			
			$result = $this->db->get_result();
			
			if (!$result['id'] || $result['id'] != $this->eval_id) {
				$this->abort('noid');
			}
			
			$this->db->close();
		}
		
		// used to tell the js on the smart.php page that the user has never saved their evaluation
		// so even if they try to leave without modifying any fields they will get prompted to save
		public function need_to_save() {
			return $this->to_save ? 'true' : 'false'; 
		}
		
		
		// returns the evaluation ID from the database
		public function get_eval_id() {
			return $this->eval_id;
		}
		
		
		// returns the type of load action
		public function get_action() {
			return $this->action;
		}
		
		
		// generic function to return the user to the start page with the relevant error code
		private function abort($code) {
			header("Location: index.php?err=" . $code);
			die();
		}
		
		
		// wipes the evaluation field in the database clean when requested by the user
		// users cannot delete the entire entry for an evaluation, as they have to be retained for tracking purposes
		public function delete_evaluation() {
			if ($this->license == 'unlimited') {
				return $this->permanent_delete();
			}
			
			else {
				return $this->data_delete();
			}
		}
		
		private function permanent_delete() {
			if (!$this->db->prepare("DELETE FROM evaluations WHERE username = ? AND id = ?")) {
				return false;
			}
			
			if (!$this->db->bind_param("si", array($this->username, $this->eval_id))) {
				return false;
			}
			
			if (!$this->db->execute()) {
				return false;
			}
			
			$this->db->close();
			
			return true;
		}
		
		private function data_delete() {
		
			$del_date = '0000-00-00 00:00:00';
			$del_data = '';
			$del_status = 'deleted';
			
			if (!$this->db->prepare("UPDATE evaluations SET status = ?, evaluation = ?, modified = ? WHERE username = ? AND id = ?")) {
				return false;
			}
			
			if (!$this->db->bind_param("ssssi", array($del_status, $del_data, $del_date, $this->username, $this->eval_id))) {
				return false;
			}
			
			if (!$this->db->execute()) {
				return false;
			}
			
			$this->db->close();
			
			return true;
		}
		
		
		// the only time a record can be deleted is if the user accidentally loads an ace report again
		// if when prompted they chose to delete the evaluation instead of continuing, this function is called 
		public function delete_record() {
			
			if (!$this->db->prepare("DELETE FROM evaluations WHERE username = ? AND id = ? LIMIT 1")) {
				return false;
			}
			
			if (!$this->db->bind_param("si", array($this->username, $this->eval_id))) {
				return false;
			}
			
			if (!$this->db->execute()) {
				return false;
			}
			
			$this->db->close();
			
			return true;
		}
		
		
		// create a default uuid for blank evaluations
		private function generate_uuid() {
			return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
				// 32 bits for "time_low"
				mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),
				
				// 16 bits for "time_mid"
				mt_rand( 0, 0xffff ),
				
				// 16 bits for "time_hi_and_version",
				// four most significant bits holds version number 4
				mt_rand( 0, 0x0fff ) | 0x4000,
				
				// 16 bits, 8 bits for "clk_seq_hi_res",
				// 8 bits for "clk_seq_low",
				// two most significant bits holds zero and one for variant DCE1.1
				mt_rand( 0, 0x3fff ) | 0x8000,
				
				// 48 bits for "node"
				mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
			);
		}
	}
?>
