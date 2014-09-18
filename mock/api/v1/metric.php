<?php
  session_start();
  sleep(1);
  
  $types = new stdClass();
  $types->project = 2000;
  $types->org = 100;
  $types->user = 1000;
  
  //api/v1/metric?type&start&end&skip&limit
  if(isset($_SESSION['user']) && $_SESSION['user']){
    header('Content-type: application/json');
    $total = $types->{$_GET['type']};
    $max = $total / 10;
    $results  = [];
    
    $start    = $_GET['start'];
    $end      = $_GET['end'];
    $limit    = isset($_GET['limit']) ? $_GET['limit'] : false;
    $skip     = isset($_GET['skip']) ? $_GET['skip'] : false;
    $days     = floor(($end - $start) / (60 * 60 * 24 * 1000)) + 1;
    for($i = 0; $i < $days; $i++){
      $new = rand(0, $max);
      $deleted = rand(0, $max / 10);
      $total += $new - $deleted;
      
      $day = new stdClass();
      $day->date = $start + (60 * 60 * 24 * 1000 * $i);
      $day->{'new'} = $new;
      $day->deleted = $deleted;
      $day->total = $total;
      $results[] = $day;
    }
    
    echo json_encode($results);
  } else {
    header('HTTP/1.1 403 Not Authenticated');
    echo 'Not Authenticated';
  }
?>