<?php

function save($path, $data) {

	if (!$fp = @fopen($path, 'wb')) {
		return false;
	}

	fwrite($fp, $data);
	@fclose($fp);

	return true;
}

function runCommand($cmd, &$retval) {

	syslog(LOG_WARNING, $cmd);
	$retval = array();
	exec($cmd, $retval);
	$log = implode("\n", $retval);
	syslog(LOG_WARNING, $log);
	return $log;
}

$msg = NULL;

if (! empty($_POST)) {
	$msg = $_POST['msg'];
} elseif (! empty($_GET)) {
	$msg = $_GET['msg'];
}

if (empty($msg)) {
	die('No message.');
}

$config = parse_ini_file('config.ini');

$codePath = $config['code-path'];
$path = $config['save-path'];

if (!is_dir($path)) {
	mkdir($path, 0777);
}

$now = date('Y_m_d_H_i_s');

$jsonPath = $path . '/'. $now . '.json';
$savePath = $path . '/'. $now . '.mp4';

$msg = base64_decode(base64_decode($msg));

save($jsonPath, $msg);

$cmd = "cd $codePath && . .env/bin/activate && ./blossoming.py config.ini templates/tts.json $jsonPath $savePath";

$log = runCommand($cmd, $retval);

echo("<p><a href='files/$now.json'>$now.json</a></p>");
echo("<p><a href='files/$now.mp4'>$now.mp4</a></p>");
echo("<p><a href='datas/'>Data</a></p>");
echo("<pre>$log</pre>");
?>


