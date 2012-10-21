<?php session_start(); ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/tr/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en"> 
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="author" content="Jason Chavannes <jason.chavannes@gmail.com>" />
	<title>Socket Smash</title>

	<script type="text/javascript"><?php
		echo "var SESSIONID = '".session_id()."';";
	?></script>

	<script type="text/javascript" src="js/3p/jquery.min.js"></script>
	<script type="text/javascript" src="js/3p/jquery-ui.min.js"></script>
	<script type="text/javascript" src="js/3p/socket.io.js"></script>

	<link rel="stylesheet" href="style.css" />
	<link rel="shortcut icon" href="img/favicon.ico" />
</head>
<body>
	<h1>Socket Smash</h1>
	<div style='width:1000px; margin:0px auto;'>
		<b>Press A to attack. Use arrow keys to move and space to jump.</b> King of the hill: get points from the orange platform.
	</div>
	<div class='container'>
		<div class='messages'>
			<div class='scores'></div>
			<div class='winner'></div>
		</div>
	</div>
	<div style='width:1000px; margin:0px auto;'>
		<div class="fb-like" data-href="https://www.facebook.com/socketgames" data-send="false" data-width="450" data-show-faces="false" style='padding-top:5px; height:29px;'></div><br/><a style='font-size:20px;' href='http://socketracing.com/' target='_blank'>Try out Socket Racing!</a></div>

	<script type='text/javascript'>
	/* Author: Jason Chavannes <jason.chavannes@gmail.com>
	 * Date: 9/2/2012 */
	<?php $dir = str_replace('//','/',dirname(__FILE__).'/'); ?>
	<?php echo file_get_contents($dir.'js/arenas/irule.js'); ?>
	<?php //echo file_get_contents($dir.'js/arenas/safron.js'); ?>
	<?php echo file_get_contents($dir.'js/Animate.js'); ?>
	<?php echo file_get_contents($dir.'js/Arena.js'); ?>
	<?php echo file_get_contents($dir.'js/Controls.js'); ?>
	<?php echo file_get_contents($dir.'js/Moves.js'); ?>
	<?php echo file_get_contents($dir.'js/Socket.js'); ?>
	</script>

	<script type="text/javascript">
	  var _gaq = _gaq || [];
	  _gaq.push(['_setAccount', 'UA-34244249-2']);
	  _gaq.push(['_trackPageview']);
	  (function() {
	    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	  })();
	</script>
	<div id="fb-root"></div>
	<script>(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=290797547634776";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));</script>
</body>
</html>