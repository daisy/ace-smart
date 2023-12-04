<?php if($settings->show_tos == 1){ ?>
  <h3 class="terms-cond"><label for="confirm"> <?=lang("JOIN_TC");?></label></h3>
    <?php
    if(!isset($_SESSION['us_lang']) || $_SESSION['us_lang'] == 'en-US' || $_SESSION['us_lang'] == '' ){
    require $abs_us_root.$us_url_root.'usersc/includes/user_agreement.php';
    }else{
      if(file_exists($abs_us_root.$us_url_root.'usersc/lang/termsandcond/'.$_SESSION['us_lang'].'.php')){
        require $abs_us_root.$us_url_root.'usersc/lang/termsandcond/'.$_SESSION['us_lang'].'.php';
      }else{
        require $abs_us_root.$us_url_root.'usersc/includes/user_agreement.php';
      }
    }
    ?>

  <label><input type="checkbox" id="agreement_checkbox" name="agreement_checkbox"> <?=lang("JOIN_ACCEPTTC");?></label>
<?php } //if TOS enabled ?>
