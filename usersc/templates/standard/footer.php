<?php
require_once $abs_us_root.$us_url_root.'usersc/templates/'.$settings->template.'/container_close.php'; //custom template container

require_once $abs_us_root.$us_url_root.'users/includes/page_footer.php';

?>
<script>
var $hamburger = $(".hamburger");
$hamburger.on("click", function(e) {
  $hamburger.toggleClass("is-active");
  // Do something else, like open/close menu
});
</script>

<script>
// (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
// function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
// e=o.createElement(i);r=o.getElementsByTagName(i)[0];
// e.src='//www.google-analytics.com/analytics.js';
// r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
// ga('create','UA-XXXXX-X','auto');ga('send','pageview');
</script>

<footer>
<p>
	<a href="/user-guide/" target="_blank">User Guide</a> | 
	<a href="/faq.html" target="_blank">FAQ</a> | 
	<a href="/new.html" target="_blank">What's New</a> | 
	<a href="https://github.com/daisy/ace-smart/issues" target="_blank">Report a Problem</a> |
	<a href="https://daisy.org/KBSponsor" target="_blank">Support</a>
</p>
<p>&copy; <?php echo date('Y'); ?> <?=$settings->copyright; ?></p>
</footer>
<?php require_once $abs_us_root.$us_url_root.'users/includes/html_footer.php'; ?>
