<?php
  session_start();
  
  $_SESSION['user'] = true;
  header('Location: ' . $_GET['redirect']);
?>