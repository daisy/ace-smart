<?php require_once 'users/init.php' ?>
<?php require_once 'php/db.php' ?>

<?php if (!securePage($_SERVER['PHP_SELF'])) { die(); } ?>

<?php
	
	$err = "";
	$updated = false;
	
	// check id email and access are set in input parameters
	$email = isset($_GET['email']) ? $_GET['email'] : (isset($_POST['email']) ? $_POST['email'] : "");
	$access = isset($_GET['gcaUser']) ? $_GET['gcaUser'] : (isset($_POST['gcaUser']) ? $_POST['gcaUser'] : "");
	
	if ($email && $access) {
	
		$modules = "born_accessible";
		
		if ($access == "false") {
			$modules = "";
		}
		
		$db = new SMART_DB();
		
		if ($db->connect()) {
		
			if ($db->prepare("UPDATE users SET modules = ? WHERE email = ?")) {
			
				if ($db->bind_param("ss", array($modules, $email))) {
				
				    if ($db->execute()) {
				    	$updated = true;
				    }
				    else {
						$err = "Failed to update database. Please try again.";
				    }
				}
				
				else {
					$err = "Failed binding parameters. Please try again.";
				}
			}
			
			else {
				$err = "Failed to prepare database statement. Please try again.";
			}
		}
		
		else {
			$err = "Failed to connect to database. Please try again.";
		}
	    
	    $db->close();
	}
	
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8"/>
		<title>Confirm GCA Access Rights - Ace SMART</title>
		<link rel="stylesheet" type="text/css" href="css/a11y.css<?= '?v=' . $smart_version ?>"/>
		<link rel="stylesheet" type="text/css" href="css/tabs.css<?= '?v=' . $smart_version ?>"/>
		<style type="text/css">
			body {
				background-color: rgb(255,255,255) !important;
			}
			h1 {
				font-size: 2.3rem !important;
			}
			h2 {
				font-size: 1.8rem !important;
				color: rgb(0,0,0) !important;
			}
			h1,h2 {
				text-indent: 2rem !important;
			}
			div.alert {
				background-color: rgb(245,245,245);
				width: 47rem;
				padding: 1rem;
				margin-top: 2rem;
				margin-bottom: 2rem;
			}
			p.confirm {
				color: rgb(0,0,180);
				font-weight: bold;
			}
			form#nextStep {
				margin-left: 2rem;
				margin-top: 2rem;
			}
			form#nextStep > * {
				margin-bottom: 1rem;
			}
			section#userList {
				margin-top: 3rem;
			}
		</style>
	</head>
	<body>
		<header>
			<h1 class="ace_login_hd">
				<span><img src="/images/daisy_high.jpg" alt="DAISY"></span>
				<span>Ace <span class="smart_hd">SMART</span></span>
			</h1>
			<h2>Access to Born Accessible Tab</h2>
		</header>
		
		<main>
			<?php
				if ($updated) {
					
					$status_msg = $access == "true" ? "now has" : "no longer has";
					
					echo <<<HTML
	<div class="alert" role="alert">
		<p class="confirm">Database successfully updated!</p>
		<p>User {$email} {$status_msg} access to the Born Accessible tab.</p>
	</div>
HTML;
				}
				
				else if ($err) {
					echo <<<HTML
	<div class="alert" role="alert">
		<p class="confirm">Database update failed!</p>
		<p>{$err}</p>
	</div>
HTML;
				}
			?>
			
			<section id="confirm">
				<form id="nextStep" method="post" action="verify_gca.php">
					<div><label>Email: <input type="text" name="email" id="email"/></label></div>
					<div role="radiogroup" aria-labelledby="access-label">
						<span id="access-label">Access:</span>
						<label><input type="radio" id="gca-yes" name="gcaUser" value="true" checked> Grant</label>
						<label><input type="radio" id="gca-no" name="gcaUser" value="false"> Revoke</label>
					</div>
					<input type="submit" value="Update">
				</form>
			</section>
			<section id="userList">
				<h2>User Access List</h2>
				<ul>
					<?php
						$db = new SMART_DB();
						if ($db->connect()) {
							$user_query = "SELECT fname, lname, email FROM users WHERE modules LIKE '%born_accessible%' ORDER BY fname, lname, email";
							
							if ($db->prepare($user_query)) {
							
								if ($db->execute()) {
								
									$emails = $db->get_results();
									
									if (!$emails) {
										echo "<li>No active GCA members found.</li>";
									}
									
									else {
										foreach ($emails as $row) {
											echo "<li>${row['fname']} ${row['lname']} &#8212; ${row['email']}</li>";
										}
									}
									
									$db->close();
								}
								else {
									echo "<li>Failed to execute query.</li>";
								}
							}
							else {
								echo "<li>Failed to prepare query.</li>";
							}
						}
						else {
							echo "<li>Failed to connect to database.</li>";
						}
					?>
				</ul>
			</section>
		</main>
	</body>
</html>
