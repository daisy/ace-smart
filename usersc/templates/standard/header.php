<?php require_once($abs_us_root.$us_url_root.'users/includes/template/header1_must_include.php'); ?>


<?php require_once($abs_us_root.$us_url_root.'usersc/templates/'.$settings->template.'/assets/fonts/glyphicons.php'); ?>

<meta name="viewport" content="width=device-width, initial-scale=1"/>

<link rel="stylesheet" href="<?=$us_url_root?>usersc/templates/<?=$settings->template?>/assets/css/bootstrap.min.css">


<link href="<?=$us_url_root?>users/css/datatables.css" rel="stylesheet">

<link href="<?=$us_url_root?>css/sponsor.css" rel="stylesheet">

<link rel="stylesheet" href="<?=$us_url_root?>users/fonts/css/font-awesome.min.css">


<script type="text/javascript">
if (typeof jQuery == 'undefined') {
  document.write(unescape("%3Cscript src='<?=$us_url_root?>users/js/jquery.js' type='text/javascript'%3E%3C/script%3E"));
}
</script>
<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
<style media="screen">
body {
font-family: 'Roboto', sans-serif !important;
}
</style>


<link rel="icon" type="image/x-icon" href="https://smart.daisy.org/favicon.ico" sizes="any"/>

<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="<?=$us_url_root?>usersc/templates/<?=$settings->template?>/assets/js/bootstrap.min.js" type="text/javascript"></script>
<link href="<?=$us_url_root?>usersc/templates/<?=$settings->template?>/assets/css/hamburgers.min.css" rel="stylesheet">
<?php
//optional
if(file_exists($abs_us_root.$us_url_root.'usersc/templates/'.$settings->template.'.css')){?> <link href="<?=$us_url_root?>usersc/templates/<?=$settings->template?>.css" rel="stylesheet"> <?php } ?>

</head>
<?php require_once($abs_us_root.$us_url_root.'users/includes/template/header3_must_include.php'); ?>
