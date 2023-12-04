<?php
// This is a user-facing page
/*
UserSpice 5
An Open Source PHP User Management System
by the UserSpice Team at http://UserSpice.com

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
require_once '../users/init.php';
if (!securePage($_SERVER['PHP_SELF'])) {
    die();
}
require_once $abs_us_root.$us_url_root.'users/includes/template/prep.php';
$hooks = getMyHooks();
includeHook($hooks, 'pre');

if (!empty($_POST['uncloak'])) {
    logger($user->data()->id, 'Cloaking', 'Attempting Uncloak');
    if (isset($_SESSION['cloak_to'])) {
        $to = $_SESSION['cloak_to'];
        $from = $_SESSION['cloak_from'];
        unset($_SESSION['cloak_to']);
        $_SESSION[Config::get('session/session_name')] = $_SESSION['cloak_from'];
        unset($_SESSION['cloak_from']);
        logger($from, 'Cloaking', 'uncloaked from '.$to);
        Redirect::to($us_url_root.'users/admin.php?view=users&err=You+are+now+you!');
    } else {
        Redirect::to($us_url_root.'users/logout.php?err=Something+went+wrong.+Please+login+again');
    }
}

//dealing with if the user is logged in
if ($user->isLoggedIn() || !$user->isLoggedIn() && !checkMenu(2, $user->data()->id)) {
    if (($settings->site_offline == 1) && (!in_array($user->data()->id, $master_account)) && ($currentPage != 'login.php') && ($currentPage != 'maintenance.php')) {
        $user->logout();
        logger($user->data()->id, 'Errors', 'Sending to Maint');
        Redirect::to($us_url_root.'users/maintenance.php');
    }
}
$get_info_id = $user->data()->id;
// $groupname = ucfirst($loggedInUser->title);
$raw = date_parse($user->data()->join_date);
$signupdate = $raw['month'].'/'.$raw['day'].'/'.$raw['year'];
$userdetails = fetchUserDetails(null, null, $get_info_id); //Fetch user details
?>

<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"/>

<div id="page-wrapper">
<div class="container">
<div class="well">
<div class="row">
	<div class="col-sm-12 col-md-3">
		<p>
		</p>
	<?php if(isset($_SESSION['cloak_to'])){ ?>
		<form class="" action="account.php" method="post">
			<input type="submit" name="uncloak" value="Uncloak!" class='btn btn-danger btn-block'>
		</form><br>
		<?php }
        ?>
		<?php includeHook($hooks, 'body'); ?>
	</div>
	<div class="col-sm-12 col-md-9">
		<h1 id="username"><?=echousername($user->data()->id); ?></h1>
		<p><span id="fname"><?=ucfirst($user->data()->fname).' '.ucfirst($user->data()->lname); ?> </span></p>
		<p><?=lang('ACCT_SINCE'); ?>: <?=$signupdate; ?></p>
		<p><?=lang('ACCT_LOGINS'); ?>: <?=$user->data()->logins; ?></p>
		<?php
        includeHook($hooks, 'bottom'); ?>
		<p>Last Login: <?=$user->data()->last_login?></p>
		<?php if (!$user->data()->shared) { ?>
		<p><a href="../users/user_settings.php" class="btn btn-primary"><?=lang("ACCT_EDIT")?></a></p>
		<form type="submit" id="delete_user_action" action="../account_delete.php" method="post">
			<p><input type="button" id="delete_user_button" value="Delete Account" class="btn btn-primary"/></p>
			<input type="hidden" name="delete_user" id="delete_user" value="true"/>
		</form>
		<?php } ?>
	</div>

</div>

</div>
	<?php languageSwitcher(); ?>
</div> 

</div> 

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

<div id="acct_del" aria-label="Delete Account" title="Delete Account">
	<p><strong style="color: rgb(190,0,0)">WARNING</strong>: You are about to delete your account and all data associated with it. <strong>This action cannot be undone.</strong><p>
	<p>To confirm you wish to delete your account, please enter your username and click Ok.</p>
	<div><input type="text" aria-label="username" id="acct_name"/></div>
</div>

<script>

	var del_buttons = {};
		del_buttons['Ok'] = function() {
			deleteAccount(document.getElementById('acct_name').value);
		};
		del_buttons['Cancel'] = function() {
			$(this).dialog('close');
		};

	var del_dialog = $("#acct_del").dialog({
		autoOpen: false,
		height: 350,
		width: 550,
		modal: true,
		buttons: del_buttons
	});
	
	function deleteAccount(acct_name) {
		if (acct_name === '<?=echousername($user->data()->id); ?>') {
			$('#delete_user_action').submit();
		}
		else {
			alert('Incorrect username entered. Account will not be deleted.');
			del_dialog.dialog('close');
		}
	}
	
	$('input#delete_user_button').click( function(){
		del_dialog.dialog('open');
		return false;
	});

</script>




<?php require_once $abs_us_root.$us_url_root.'users/includes/html_footer.php'; ?>
