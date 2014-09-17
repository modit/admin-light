<?php
  $path = __DIR__  . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
  if (file_exists($path)) {
    return false; // serve the requested resource as-is.
  } else if(file_exists($path . 'index.php')){
    include_once ($path . 'index.php');
  } else if(file_exists($path . '.php')){
    include_once ($path . '.php');
  } else {
    include_once 'index.php';
  }
?>