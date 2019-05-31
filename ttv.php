<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; CHARSET=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.0, user-scalable=yes" />
  <link rel="stylesheet" href="css/style.css" />
  <title>Text To Video</title>
</head>
<body>

  <div id='container'>

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

putenv("PYTHONIOENCODING=utf-8");

$cmd = "cd $codePath && . .env/bin/activate && LANG=en_US.UTF-8 PYTHONIOENCODING=utf-8 python blossoming.py config.ini templates/tts.json $jsonPath $savePath";

$log = runCommand($cmd, $retval);

if (file_exists($savePath)) {
	echo("<video controls=''><source src='files/$now.mp4' type='video/mp4'>Your browser does not support the video tag.</video>");
} else {
	echo("<p><a href='datas/'>Data</a></p>");
	echo("<p>$cmd</p>");
	echo("<pre>$log</pre>");
}
?>
  </div>
</body>
</html>

