<div class="row">
	<div class="col-lg-12">
  		<aside class="profile-nav alt">
    		<section class="card">
    			<header>
  				<div class="collapse bg-dark" id="navbarHeader">
    				<div class="container">
      					<div class="row">
        					<div class="col-sm-12 py-2">
          					<h4 class="text-white">About</h4>
          					<p class="text-muted">This widget for check system health!</p>
        					</div>
      					</div>
    				</div>
  				</div>
  				<div class="navbar-dark bg-dark shadow-sm py-2">
    				<div class="container d-flex justify-content-between">
      					<a href="#" class="navbar-brand d-flex align-items-center">
        				<strong>System Health</strong>
      					</a>
      					<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
        				<span class="navbar-toggler-icon"></span>
      					</button>
    				</div>
  				</div>
				</header>
				<main role="main">
  					<div class="album">
    					<div class="container">
      						<div class="row py-3">

       							<div class="col-md-4 text-center">
          							<div class="card shadow-sm">
            							<div class="card-body">
              							<p class="card-text badge badge-primary py-3">
              								<?php
              								$load = sys_getloadavg();
											if ($load[0] > 80) {
    										echo "Server is too busy!";
											} else {
												echo "Server load avg : ".$load[0];
											}
              								?>
              							</p>
            							</div>
          							</div>
        						</div>

        						<div class="col-md-4 text-center">
          							<div class="card shadow-sm">
            							<div class="card-body">
              							<p class="card-text badge badge-primary py-3">
              								<?php
											$disktotal = disk_total_space ('/');
											$diskfree  = disk_free_space  ('/');
											$diskuse   = round (100 - (($diskfree / $disktotal) * 100)) .'%';
											echo "Total disk usage : ".round($disktotal / 1000000)." MB<br><br>";
											echo "Disk usage avg : ".$diskuse;
              								?>
              							</p>
            							</div>
          							</div>
        						</div>

        						<div class="col-md-4 text-center">
          							<div class="card shadow-sm">
            							<div class="card-body">
              							<p class="card-text badge badge-primary py-3">
              								<?php
											$uptime = floor(preg_replace ('/\.[0-9]+/', '', file_get_contents('/proc/uptime')) / 86400);
											echo "Server uptime : ".$uptime;
              								?>
              							</p>
            							</div>
          							</div>
        						</div>

        						<div class="col-md-4 text-center">
          							<div class="card shadow-sm">
            							<div class="card-body">
              							<p class="card-text badge badge-primary py-3">
              								<?php
											$proc_count = 0;
											$dh = opendir('/proc');
											while ($dir = readdir($dh)) {
												if (is_dir('/proc/' . $dir)) {
													if (preg_match('/^[0-9]+$/', $dir)) {
														$proc_count ++;
													}
												}
											}
											echo "Number of processes : ".$proc_count;
              								?>
              							</p>
            							</div>
          							</div>
        						</div>



        						<div class="col-md-4 text-center">
          							<div class="card shadow-sm">
            							<div class="card-body">
              							<p class="card-text badge badge-info py-3">
              								<?php
											echo "Server Type : ".PHP_OS;
              								?>
              							</p>
            							</div>
          							</div>
        						</div>

        						<div class="col-md-4 text-center">
          							<div class="card shadow-sm">
            							<div class="card-body">
              							<p class="card-text badge badge-info py-3">
              								<?php
											$mem = memory_get_usage(true);
											if ($mem < 1024) {
											$memory = $mem .' B'; 	
											} elseif ($mem < 1048576) {
											$memory = round($mem / 1024, 2) .' KB';
											} else {
											$memory = round($mem / 1048576, 2) .' MB';
											}
											echo "Memory Usage : ".$memory;
              								?>
              							</p>
            							</div>
          							</div>
        						</div>
 
      						</div>
    					</div>
  					</div>
				</main>
    		</section>
    	</aside>
	</div>
</div>