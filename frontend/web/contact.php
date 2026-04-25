<?php
if ($_SERVER['REQUEST_METHOD']=='POST'){
    $name=$_POST['name'];
    $email=$_POST['email'];
    $message=$_POST['message'];
    $to='support@dcneetcounselling.com';
    $subject='New Website Message';
    $body="Name: $name\nEmail: $email\n\nMessage:\n$message";
    $headers='From: support@dcneetcounselling.com';
    if(mail($to,$subject,$body,$headers)){
        echo 'success';
    } else {
        echo 'error';
    }
}
?>
