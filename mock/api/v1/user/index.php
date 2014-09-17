<?php
  session_start();
  
  if($_SESSION['user']){
    header('Content-type: application/json');
    echo '{"_id":"53ab3d511548ef6e5c999999","created":"2014-06-25T21:21:21.750Z","modified":"2014-07-23T14:24:20.935Z","__v":0,"superadmin":true,"invites":3,"indexedName":"joe","profile":{"username":"joe","email":"joe@mod.it","name":"Joe Admin"},"gravatar":"53ab3d511548ef6e5c999999","$owner":true,"isGitHubAuthorized":true,"id":"53ab3d511548ef6e5c999999"}';
  } else {
    header('HTTP/1.1 403 Not Authenticated');
    echo 'Not Authenticated';
  }
?>