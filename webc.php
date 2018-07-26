<?php
    error_reporting(E_ERROR | E_PARSE);
    ignore_user_abort(true);
    set_time_limit(0);
    // Minify input
    function sanitize_output($buffer) {
        $search = array('/\>[^\S ]+/s', '/[^\S ]+\</s', '/(\s)+/s');
        $replace = array('>','<','\\1');
        $buffer = preg_replace($search, $replace, $buffer);
        return $buffer;
    }
    ob_start("sanitize_output");
    require_once("WebC/scripts/login/config/config.php");
    // Get initialize variables
    $Init = new Init();
    // Set timezone
    date_default_timezone_set($Init->time_zone);
    // Get login class and check login
    require_once("WebC/scripts/login/class/login.php");
    $login = new Login();
    // Check if access folder exists
    if ($login->isUserLoggedIn() == true) {
        // Logout if folder doesn't exist
        if ($login->doesUserGotAccess() == false) {
            header( 'Location: webc.php?logout' );
        }
    }
    // Get Webc class
    include_once("WebC/scripts/index.class.php");
    $objectIndex = new WebCommander();
?>
<!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Web Commander</title>
        <!--  Add device scalable -->
        <meta name="viewport" content="width=device-width initial-scale=1.0 maximum-scale=1.0 user-scalable=no" />
        <!--  Favicon for all devices -->
        <link rel="apple-touch-icon" sizes="57x57" href="WebC/img/icon/apple-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="WebC/img/icon/apple-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="WebC/img/icon/apple-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="WebC/img/icon/apple-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="WebC/img/icon/apple-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="WebC/img/icon/apple-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="WebC/img/icon/apple-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="WebC/img/icon/apple-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="WebC/img/icon/apple-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192"  href="WebC/img/icon/android-icon-192x192.png">
        <link rel="icon" type="image/png" sizes="32x32" href="WebC/img/icon/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="96x96" href="WebC/img/icon/favicon-96x96.png">
        <link rel="icon" type="image/png" sizes="16x16" href="WebC/img/icon/favicon-16x16.png">
        <link rel="shortcut icon" type="image/x-icon" href="WebC/img/icon/favicon.ico">
        <link rel="manifest" href="WebC/img/icon/manifest.json">
        <meta name="msapplication-TileColor" content="#1B1C1D">
        <meta name="msapplication-TileImage" content="WebC/img/icon/ms-icon-144x144.png">
        <meta name="theme-color" content="#222222">
        <!--  Add stylesheets -->
        <link rel="stylesheet" href="WebC/css/semantic.css?<?php echo date('l jS \of F Y h:i:s A'); ?>">
        <link rel="stylesheet" href="WebC/css/override.css?<?php echo date('l jS \of F Y h:i:s A'); ?>">
        <!--  Add google font - Tajawal -->
        <link href="https://fonts.googleapis.com/css?family=Tajawal:500,700,800" rel="stylesheet">
    </head>
    <body>
        <!--  Page dimmer for work in progress -->
        <div class="ui active dimmer hidden-content">
            <div class="ui indeterminate text loader"></div>
        </div>
        <?php
            // Check if user is logged in
            if ($login->isUserLoggedIn() == true) {
                // View mobile menu
                $objectIndex->viewMobileMenu();
                // View wide sidebars for viewing/editing
                $objectIndex->viewSidebar();
            }
            // View log-in page if logged out
            else
                $objectIndex->loginView();
        ?>
        <div class="pusher">
            <div class="ui small black icon message">
                <h4></h4>
            </div>
            <?php
                // Check if user is logged in
                if ($login->isUserLoggedIn() == true) {
                    // View top fixed menu
                    $objectIndex->viewTopMenu();
                    // View all modals
                    $objectIndex->viewModal();
                    // View window segments - left and right window
                    $objectIndex->viewWindowSegments();
                    // Touch keyboard options
                    $objectIndex->showKeyboard();
                    // Show bottom menu
                    $objectIndex->showBottomMenu();
                }
            ?>
        </div>
        <script src="WebC/js/vendor/jquery-3.2.1.min.js"></script>
        <script src="WebC/js/vendor/semantic.min.js"></script>
        <?php
            // Check if user logged in
            if ($login->isUserLoggedIn() == true) {
                // Fetch jquery plugins for webc if logged in
        ?>
                <script src="WebC/js/webc.js?<?php echo date('l jS \of F Y h:i:s A'); ?>"></script>
        <?php
            }
        ?>
    </body>
</html>