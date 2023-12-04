



<?php
if(!empty($_POST)){
  if(!empty($_POST['emptySystem'])){
    $db->query("TRUNCATE TABLE logs");
  }
  if(!empty($_POST['emptySecurity'])){
    $db->query("TRUNCATE TABLE audit");
  }
  if(!empty($_POST['emptyMsg'])){
    $db->query("TRUNCATE TABLE messages");
    $db->query("TRUNCATE TABLE message_threads");
    $db->query("TRUNCATE TABLE notifications");
  }

  if(!empty($_POST['emptyBanned'])){
    $widgetUsers = $db->query("SELECT * FROM users WHERE permissions = 0")->results();
    foreach($widgetUsers as $w){
      $db->query("DELETE FROM profiles WHERE user_id = ?",[$w->id]);
      $db->query("DELETE FROM user_permission_matches WHERE user_id = ?",[$w->id]);
      $db->query("DELETE FROM users WHERE id = ?",[$w->id]);
      $db->query("DELETE FROM users_session WHERE user_id = ?",[$w->id]);
      $db->query("DELETE FROM fingerprints WHERE fkUserID = ?",[$w->id]);
    }
  }

}

?>


  <div class="row">

    <div class="col-6 col-sm-3">
      <div class="card">
          <div class="card-body">
            <form class="" action="" method="post" name="system">
              <input type="submit" name="emptySystem" value="Empty System Logs" class="btn btn-danger btn-lg btn-block dbWidgetDelete">
            </form>
            <p align="center" style="margin-bottom:0px;">Empties logs db table</p>
            <?php $c = $db->query("SELECT id FROM logs")->count();?>
            <p align="center" style="margin-bottom:-5px;">(<?=$c?> rows)</p>
          </div>
      </div>
    </div>

    <div class="col-6 col-sm-3">
      <div class="card">
          <div class="card-body">
            <form class="" action="" method="post">
              <input type="submit" name="emptySecurity" value="Empty Security Logs" class="btn btn-warning btn-lg btn-block dbWidgetDelete">
            </form>
            <p align="center" style="margin-bottom:0px;">Empties audit db table</p>
            <?php $c = $db->query("SELECT id FROM audit")->count();?>
            <p align="center" style="margin-bottom:-5px;">(<?=$c?> rows)</p>
          </div>
      </div>
    </div>

    <div class="col-6 col-sm-3">
      <div class="card">
          <div class="card-body">
            <form class="" action="" method="post" name="banned">
              <input type="submit" name="emptyBanned" value="Delete Banned Users" class="btn btn-secondary btn-lg btn-block dbWidgetDelete">
            </form>
            <p align="center" style="margin-bottom:0px;">Empties several rows</p>
            <?php $c = $db->query("SELECT id FROM users WHERE permissions = 0")->count();?>
            <p align="center" style="margin-bottom:-5px;">(<?=$c?> users)</p>
          </div>
      </div>
    </div>
    <div class="col-6 col-sm-3">
      <div class="card">
          <div class="card-body">
            <form class="" action="" method="post">
              <input type="submit" name="emptyMsg" value="Clear Msgs & Notif" class="btn btn-info btn-lg btn-block dbWidgetDelete">
            </form>
            <p align="center" style="margin-bottom:0px;">Empties 3 Tables</p>
            <?php
            $cnt = 0;
            $c = $db->query("SELECT id FROM messages")->count();
            $cnt = $cnt + $c;
            $c = $db->query("SELECT id FROM message_threads")->count();
            $cnt = $cnt + $c;
            $c = $db->query("SELECT id FROM notifications")->count();
            $cnt = $cnt + $c;
            ?>
            <p align="center" style="margin-bottom:-5px;">(<?=$cnt?> rows)</p>
          </div>
      </div>
    </div>
  </div>


<script type="text/javascript">
$('.dbWidgetDelete').on('click',function(e){
  var answer=confirm('Do you want to do this? It cannot be undone!');
  if(!answer){
    e.preventDefault();
  }
});

</script>
