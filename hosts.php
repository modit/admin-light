<?php
  $CORE_HOST  = getenv('CORE_HOST');
  $API_HOST   = getenv('API_HOST');
  
  if(!$CORE_HOST){
    $CORE_HOST = 'mod.it';
  }
  
  if(!$API_HOST){
    if ($urlParts = parse_url($_SERVER['HTTP_REFERER'])){
      $API_HOST = $urlParts["host"] . '/mock';
    } else {
      $API_HOST = 'mod.it';
    }
  };
?>