<?php session_start(); ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/tr/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en"> 
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="author" content="Jason Chavannes <jason.chavannes@gmail.com>" />
	<title>Socket Smash</title>

	<script type="text/javascript"><?php echo "var SESSIONID = '".session_id()."';"; ?></script>

    <script type="text/javascript" src="js/3p/head.min.js"></script>
    <script type="text/javascript">
        var socketIOUrl = ('https:' == document.location.protocol) ? '' : 'http://' + document.location.hostname + ':8236/';
        console.log("socketIOUrl: " + socketIOUrl + "socket.io/socket.io.js");
        head.js(
            "js/3p/jquery-1.9.1.min.js",
            "js/3p/jquery-ui-1.10.1.min.js",
            //"js/3p/socket.io.js",
            socketIOUrl + "socket.io/socket.io.js",
            "js/arenas/irule.js",
            //"js/arenas/safron.js",
            "js/Animate.js",
            "js/Arena.js",
            "js/AI.js",
            "js/Controls.js",
            "js/Moves.js",
            "js/Socket.js"
        );
        head.ready(function() {
            Socket.init();
            Arena.init();
            Controls.init();

            Animate.run();
            Animate.Sprites.run();
        });
    </script>

	<link rel="stylesheet" href="style.css" />
	<link rel="shortcut icon" href="img/favicon.ico" />
</head>
<body>
	<h1>Socket Smash <input type="button" value="Show Instructions" onclick="showControls();" /></h1>
	<div class='container'>
		<div class='messages'>
			<div class='scores'></div>
			<div class='winner'></div>
		</div>
        <div class='controls'>
            <img src='img/controls.png' /><br/>
            <input type="button" value="[X] Close Instructions" onclick="closeControls();" />
        </div>
        <script type="text/javascript">
            function closeControls() {
                $(".controls").hide();
                localStorage.closeControls = "closed";
            }
            function showControls() {
                $(".controls").show();
                localStorage.closeControls = "open";
            }
            head.ready(function() {
                if (localStorage.closeControls == "closed") closeControls();
            });
        </script>
        <!-- <input type='button' onclick='AI.Start();' value='Start AI' /> -->
	</div>


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
</body>
</html>