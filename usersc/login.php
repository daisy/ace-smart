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

// redirect user to https to make sure no db errors
if (!(isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] == 'on' || $_SERVER['HTTPS'] == 1)))
{
   $redirect = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
   header('HTTP/1.1 301 Moved Permanently');
   header('Location: ' . $redirect);
   exit();
}

ini_set("allow_url_fopen", 1);
if(isset($_SESSION)){session_destroy();}
require_once '../users/init.php';
require_once $abs_us_root.$us_url_root.'users/includes/template/prep.php';
$hooks =  getMyHooks();
includeHook($hooks,'pre');
?>
<?php
if(ipCheckBan()){Redirect::to($us_url_root.'usersc/scripts/banned.php');die();}
$errors = $successes = [];
if (Input::get('err') != '') {
    $errors[] = Input::get('err');
}
$reCaptchaValid=FALSE;
if($user->isLoggedIn()) Redirect::to($us_url_root.'index.php');

if (!empty($_POST['login_hook'])) {
  $token = Input::get('csrf');
  if(!Token::check($token)){
    include($abs_us_root.$us_url_root.'usersc/scripts/token_error.php');
  }

  //Check to see if recaptcha is enabled
  if($settings->recaptcha == 1){
  if(!function_exists('post_captcha')){
    function post_captcha($user_response) {
    global $settings;
    $fields_string = '';
    $fields = array(
        'secret' => $settings->recap_private,
        'response' => $user_response
    );
    foreach($fields as $key=>$value)
    $fields_string .= $key . '=' . $value . '&';
    $fields_string = rtrim($fields_string, '&');

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://www.google.com/recaptcha/api/siteverify');
    curl_setopt($ch, CURLOPT_POST, count($fields));
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, True);

    $result = curl_exec($ch);
    curl_close($ch);
    return json_decode($result, true);
}
}

// Call the function post_captcha
$res = post_captcha($_POST['g-recaptcha-response']);

if (!$res['success']) {
    // What happens when the reCAPTCHA is not properly set up
    echo 'reCAPTCHA error: Check to make sure your keys match the registered domain and are in the correct locations. You may also want to doublecheck your code for typos or syntax errors.';
}else{
 $reCaptchaValid=TRUE;
}
}
  if($reCaptchaValid || $settings->recaptcha == 0 || $settings->recaptcha == 2 ){ //if recaptcha valid or recaptcha disabled

    $validate = new Validate();
    $validation = $validate->check($_POST, array(
      'username' => array('display' => 'Username','required' => true),
      'password' => array('display' => 'Password', 'required' => true)));
      //plugin goes here with the ability to kill validation
      includeHook($hooks,'post');
      if ($validation->passed()) {
        //Log user in
        $remember = false;
        $user = new User();
        $login = $user->loginEmail(Input::get('username'), trim(Input::get('password')), $remember);
        if ($login) {
          // MG: "if" condition allows lia bypass
          if (!Input::get('auto')) {
            $hooks =  getMyHooks(['page'=>'loginSuccess']);
            includeHook($hooks,'body');
            $dest = sanitizedDest('dest');
              # if user was attempting to get to a page before login, go there
              $_SESSION['last_confirm']=date("Y-m-d H:i:s");

              if (!empty($dest)) {
                $redirect=html_entity_decode(Input::get('redirect'));
                if(!empty($redirect) || $redirect!=='') Redirect::to($redirect);
                else Redirect::to($dest);
              } elseif (file_exists($abs_us_root.$us_url_root.'usersc/scripts/custom_login_script.php')) {

                # if site has custom login script, use it
                # Note that the custom_login_script.php normally contains a Redirect::to() call
                require_once $abs_us_root.$us_url_root.'usersc/scripts/custom_login_script.php';
              } else {
                if (($dest = Config::get('homepage')) ||
                ($dest = 'account.php')) {
                  #echo "DEBUG: dest=$dest<br />\n";
                  #die;
                  Redirect::to($dest);
                }
              }
            }
          } else {
            $eventhooks =  getMyHooks(['page'=>'loginFail']);
            includeHook($eventhooks,'body');
            logger("0","Login Fail","A failed login on login.php");
            $msg = lang("SIGNIN_FAIL");
            $msg2 = lang("SIGNIN_PLEASE_CHK");
            $errors[] = '<strong>'.$msg.'</strong>'.$msg2;
          }
        }
      }
    }
    if (empty($dest = sanitizedDest('dest'))) {
      $dest = '';
    }
    $token = Token::generate();
    ?>
    
	<div class="menubar"></div>
	
    <?php if (Input::get('auto')) { ?>
    <div id="page-wrapper" style="min-height: 30rem;">
    	<div class="container">
    		<div class="row">
			    <h3>Login Successful!</h3>
		   		<p>Loading Ace report. Please be patient.</p>
			    <form action="../smart.php" method="post" id="nextStep">
			    	<input type="hidden" name="action" value="autoload"/>
			    	<input type="hidden" name="op" value="<?=Input::get('auto')?>"/>
			    	<input type="hidden" name="ace-report" value="<?=htmlspecialchars(Input::get('ace-report'))?>"/>
			    	<input type="hidden" name="pubid" value="<?=htmlspecialchars(Input::get('pubid'))?>"/>
			    </form>
			    <script>
			    	document.getElementById('nextStep').submit();
			    </script>
			</div>
		</div>
	</div>
    <?php } else { ?> 

    <div id="page-wrapper">
    	<!-- add daisy sponsor box -->
		<script src="/js/sponsor.js<?= '?v=' . $smart_version ?>"></script>
		<script>
			daisySponsor.loadSponsorInfo('smart');
		</script>
      <div class="container">
        <?=resultBlock($errors,$successes);?>
        <div class="row no-flex">
          <div class="col-sm-12 fl-30">
	          <form name="login" id="login-form" class="form-signin" action="login.php" method="post">
	              <!-- <h2 class="form-signin-heading"><?=lang("SIGNIN_TITLE","");?></h2> -->
	              <input type="hidden" name="dest" value="<?= $dest ?>" />
	
	              <div class="form-group">
	                <span id="username-label" hidden=""><?=lang("SIGNIN_UORE")?></span>
	                <input aria-labelledby="username-label" class="form-control" type="text" name="username" id="username" placeholder="<?=lang("SIGNIN_UORE")?>" required autofocus autocomplete="username">
	              </div>
	
	              <div class="form-group">
	                <span id="password-label" hidden=""><?=lang("SIGNIN_PASS")?></span>
	                <input aria-labelledby="password-label" type="password" class="form-control"  name="password" id="password"  placeholder="<?=lang("SIGNIN_PASS")?>" required autocomplete="current-password">
	              </div>
	              <?php   includeHook($hooks,'form');?>
	                <input type="hidden" name="login_hook" value="1">
	                <input type="hidden" name="csrf" value="<?=$token?>">
	                <input type="hidden" name="redirect" value="<?=Input::get('redirect')?>" />
	                <button class="submit  btn  btn-primary" id="next_button" type="submit"><i class="fa fa-sign-in"></i> <?=lang("SIGNIN_BUTTONTEXT","");?></button>
	                <?php
	                if($settings->recaptcha == 1){
	                  ?>
	                  <div class="g-recaptcha" data-sitekey="<?=$settings->recap_public; ?>" data-bind="next_button" data-callback="submitForm"></div>
	                <?php } ?>
	            </form>
	            <div class="col-sm-6"><br>
	              <a class="pull-left" href='../users/forgot_password.php'><i class="fa fa-wrench"></i> <?=lang("SIGNIN_FORGOTPASS","");?></a>
	              <br><br>
	            </div>
		      <div class="col-sm-6">
		      	<a href="<?=$us_url_root?>users/join.php" class=""><i class="fa fa-plus-square"></i> Create new account</a>
		      </div>
          </div>
          <div class="fl-70">
          	<h2 class="form-signin-heading login_intro">Welcome to Ace SMART!</h2>
          	<p>Ace SMART is made available by the <a href="https://daisy.org">DAISY Consortium</a> to help publishers
          		fully evaluate their EPUB publications against the requirements of the
        		<a href="https://www.w3.org/TR/epub-a11y/">EPUB Accessibility specification</a>.</p>
        	  <p>It is intended as a complement to the <a href="https://daisy.org/activities/software/ace/">Ace by 
        	  	DAISY</a> validation checker, covering the aspects of accessibility conformance verification that
        	  	cannot be handled by machine alone.</p>
        	  <p>SMART provides publishers with the full list of WCAG and EPUB success criteria that must be met,
        	  	as well as guidance on how to evaluate each criterion. The ability to pass and fail each
        	  	criterion is also available, ultimately allowing publishers to generate a final report covering
        	  	their full evaluation. Publishers can also save their reports and return to them later.</p>
        	  <p>SMART also provides tools to help generate accessibility metadata for use both in the EPUB
        	  	publication and in ONIX records.</p>
        	  <p>To begin using SMART, simply <a href="<?=$us_url_root?>users/join.php">create a free
        	  	account</a>.</p>
          </div>
          <?php   includeHook($hooks,'bottom');?>
          <?php languageSwitcher();?>
          </div>
        </div>

        <?php require_once $abs_us_root.$us_url_root.'usersc/templates/'.$settings->template.'/container_close.php'; //custom template container ?>

        
        <?php require_once $abs_us_root.$us_url_root.'users/includes/page_footer.php'; // the final html footer copyright row + the external js calls ?>

        

        <?php   if($settings->recaptcha == 1){ ?>
          <script src="https://www.google.com/recaptcha/api.js" async defer></script>
          <script>
          function submitForm() {
            document.getElementById("login-form").submit();
          }
          </script>
        <?php } ?>
        <?php } ?>
        <?php require_once $abs_us_root.$us_url_root.'usersc/templates/'.$settings->template.'/footer.php'; //custom template footer?>
