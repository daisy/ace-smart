<?php
// MG: This file has been edited in the /users directory as I haven't found a way to override the
// helpers file that does the mailing to change the path to /usersc and grab a custom version
$db = DB::getInstance();
$query = $db->query("SELECT * FROM email");
$results = $query->first();
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <p>Thank you for creating an account! In order to complete the registration process, please click on the following link:</p>
    <p><a href="<?=$results->verify_url?>users/verify.php?email=<?=$email;?>&vericode=<?=$vericode;?>" class="nounderline">Verify Your Email</a></p>
    <p><small><?=lang("EML_VER_EXP")?><?=$join_vericode_expiry?> <?=lang("T_HOURS")?>.</small></p>
    <p>After verifying your email, you will be able to sign in and begin evaluating publications.</p>
    <p>Full instructions on how to use the application are available in the <a href="https://smart.daisy.org/user-guide/">user guide</a>.
    	A link to the guide is always available at the top of the application if you ever need help understanding the application.</p>
    <p>Thank you,</p>
    <p>The DAISY Team</p>
    <br>
    <p>If you believe you have received this registration in error, please ignore this email.</p>
  </body>
</html>
