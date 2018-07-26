<?php
    error_reporting(E_ERROR | E_PARSE);
    ignore_user_abort(true);
    set_time_limit(0);
    require_once("login/config/config.php");
    // Get initialize variables
    $Init = new Init();
    // Set timezone
    date_default_timezone_set($Init->time_zone);
    // Call login class
    require_once("login/class/login.php");
    $login = new Login();
    // Check if access folder exists
    if ($login->isUserLoggedIn() == true) {
        // Return if folder doesn't exist
        if ($login->doesUserGotAccess() == false) {
            return false;
        }
    }
    // Proceed if ajax call
    if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
        /*------------------------------------------------------------------
        [Update user table in directory]
        -------------------------------------------------------------------*/
        if (isset($_POST["user_name"]) && isset($_POST["user_password_hash"]) && isset($_POST["user_access"])) {
            // Data array for json
            $errors           = array();
            $data             = array();
            // Call WC class
            include_once("index.class.php");
            $wcObject = new WebCommander();
            // filter and sanitize all inputs
            $user_name    = filter_var(trim($_POST["user_name"]), FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
            $user_password_hash    = filter_var(trim($_POST["user_password_hash"]), FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
            $user_access    = filter_var(trim($_POST["user_access"]), FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
            // Check username error
            if ($user_name != "admin")
                if ($user_name == "" || strlen($user_name) > 64 || strlen($user_name) < 2 || !preg_match('/^[a-z\d]{2,64}$/i', $user_name) || $wcObject->checkUserExists($user_name)) {
                    $errors['user_name'] = 'Error';
                }
            // Check password error
            if ($user_password_hash == "" || strlen($user_password_hash) < 6) {
                $errors['user_password_hash'] = 'Error';
            }
            // Check user access error
            if ($user_name != "admin" && $user_access != "localhost")
                if ($user_access == "" || strlen($user_access) > 128 || (!file_exists($user_access) && !is_dir($user_access))) {
                    $errors['user_access'] = 'Error';
                }
            // Return if error
            if (!empty($errors)) {
                $data['success'] = false;
                $data['errors']  = $errors;
            }
            // Or update user table
            else  {
                if ($user_name != "admin") {
                    if($wcObject->insertUser($user_name, $user_password_hash, $user_access))
                        $data['success'] = true;
                    else {
                        $errors['db_access'] = 'Error';       
                        $data['success'] = false;
                        $data['errors']  = $errors;
                    }
                }
                else {
                    if($wcObject->updateUser($user_name, $user_password_hash))
                        $data['success'] = true;
                    else {
                        $errors['db_access'] = 'Error';       
                        $data['success'] = false;
                        $data['errors']  = $errors;
                    }
                }
            }
            echo json_encode($data);
        }
        /*------------------------------------------------------------------
        [View user table in modal]
        -------------------------------------------------------------------*/
        else if (isset($_POST["viewUserTable"])) {
            // Call WC class
            include_once("index.class.php");
            $wcObject = new WebCommander();
            // View user directory
            $wcObject->viewUserDirectory();
        }
        /*------------------------------------------------------------------
        [Delete user from table]
        -------------------------------------------------------------------*/
        else if (isset($_POST["userToDelete"])) {
            // Call WC class
            include_once("index.class.php");
            $wcObject = new WebCommander();
            // Delete user from directory
            echo $wcObject->deleteUser($_POST["userToDelete"]);
        }
        /*------------------------------------------------------------------
        [Check if file or folder]
        -------------------------------------------------------------------*/
        else if (isset($_POST["getFileFolder"])) {
            // Return if folder
            if(is_dir($_POST["getFileFolder"]))
                echo "Directory";
            // Return if file
            else
                echo "File";
        }
        /*------------------------------------------------------------------
        [View folder content in window]
        -------------------------------------------------------------------*/
        else if (isset($_POST["viewFileFolder"]) && isset($_POST["window"])) {
            // Call WC class
            include_once("index.class.php");
            $wcObject = new WebCommander();
            // Return folder content
            $wcObject->showWindow($_POST["viewFileFolder"], $_POST["window"]);        
        }
        /*------------------------------------------------------------------
        [Get file content for editing]
        -------------------------------------------------------------------*/
        else if (isset($_POST["getFileContent"])) {
            // Call WC class
            include_once("index.class.php");
            $wcObject = new WebCommander();
            // Return file content
            echo $wcObject->getFileContent($_POST["getFileContent"]);
        }
        /*------------------------------------------------------------------
        [Return image url to view]
        -------------------------------------------------------------------*/
        else if (isset($_POST["getImageContent"])) {
            // Call WC class
            include_once("index.class.php");
            $wcObject = new WebCommander();
            // Return image content
            echo $wcObject->getImageContent($_POST["getImageContent"]);
        }
        /*------------------------------------------------------------------
        [Save edited file content in file location]
        -------------------------------------------------------------------*/
        else if (isset($_POST["saveFileContent"]) && isset($_POST["url"])) {
            // Call WC class
            include_once("index.class.php");
            $wcObject = new WebCommander();
            // Save edited file
            $wcObject->saveFileContent($_POST["saveFileContent"], $_POST["url"]);
            echo "Success";
        }
        /*------------------------------------------------------------------
        [Get updated file size, and date time]
        -------------------------------------------------------------------*/
        else if (isset($_POST["getSizeDateTime"])) {
            // Call WC class
            include_once("index.class.php");
            $wcObject = new WebCommander();
            // Return file size and datetime
            echo $wcObject->getFileSize($_POST["getSizeDateTime"]) . "+" . date("d-M'y H:i", filemtime($_POST["getSizeDateTime"]));
        }
        /*------------------------------------------------------------------
        [Copy file and folder to other window location]
        -------------------------------------------------------------------*/
        else if (isset($_POST["copyURL"]) && isset($_POST["copyFolder"])) {
            // Call WC class
            include_once("index.class.php");
            $wcObject = new WebCommander();
            // Get item to copy
            $copyObject = $_POST["copyURL"];
            // Get location to copy
            $locationObject = $_POST["copyFolder"];
            // Copy file to another window location
            if(!is_dir($copyObject))
                $wcObject->copyFileToFolder($copyObject, $locationObject);                    
            // Make directory and copy folder content to the directory
            else {
                // Make directory
                @mkdir($locationObject . "/" . basename($copyObject));
                // Send recursive copy for folder
                $wcObject->copyFolderToFolder($copyObject, $locationObject . "/" . basename($copyObject));
            }
            echo "Success";
        }
        /*------------------------------------------------------------------
        [Move file and folder to other window location]
        -------------------------------------------------------------------*/
        else if (isset($_POST["moveURL"]) && isset($_POST["moveFolder"])) {
            // Call WC class
            include_once("index.class.php");
            $wcObject = new WebCommander();
            // Get item to move
            $moveObject = $_POST["moveURL"];
            // Get location to move
            $locationObject = $_POST["moveFolder"];
            // Copy file ot another window location
            if(!is_dir($moveObject)) {
                $wcObject->copyFileToFolder($moveObject, $locationObject);     
                // Delete source file after copying
                $wcObject->delFile($moveObject);
            }
            // Make directory and copy folder content to the directory
            else {
                // Make directory
                @mkdir($locationObject . "/" . basename($moveObject));
                // Send recursive copy for folder
                $wcObject->copyFolderToFolder($moveObject, $locationObject . "/" . basename($moveObject));
                // Delete source directory
                $wcObject->delTree($moveObject);
            }
            echo "Success";
        }
        /*------------------------------------------------------------------
        [Upload file in location]
        -------------------------------------------------------------------*/
        else if (isset($_FILES['file']) && isset($_POST["fileLocation"])) {
            // Call WC class
            include_once("index.class.php");
            $wcObject = new WebCommander();
            // Get file name
            $filename = $_FILES['file']['tmp_name'];
            // Get upload location
            $location = $_POST["fileLocation"] . "/". $_FILES['file']['name'];
            // Upload file and output message
            $wcObject->uploadFile($filename, $location);
        }
        /*------------------------------------------------------------------
        [Compress a file or folder]
        -------------------------------------------------------------------*/
        else if (isset($_POST["zipURL"]) && isset($_POST["zipLocation"])) {
            // Call WC class
            include_once("index.class.php");
            $wcObject = new WebCommander();
            // Get file of folder to zip
            $zipSource = $_POST["zipURL"];
            // Spl class to get extension
            $spl = new SplFileInfo($zipSource);
            // Prepare zip file name if file
            if($spl->getExtension() != "")
                $zipDestination = $_POST["zipLocation"] . "/" . str_replace($spl->getExtension(), "zip", basename($zipSource));
            // Prepare zip file name if folder
            else 
                $zipDestination = $zipSource . ".zip";
            if($wcObject->zipData($zipSource, $zipDestination)) 
                echo "Success";
        }
        /*------------------------------------------------------------------
        [Create download instance in modal]
        -------------------------------------------------------------------*/
        else if (isset($_POST["downloadURL"])) {
            // Call WC class
            include_once("index.class.php");
            $wcObject = new WebCommander();
            // Get the file to download
            $downloadSource = $_POST["downloadURL"];
            // Convert the file to downloadable link
            echo $wcObject->downloadFile($downloadSource);
        }
        /*------------------------------------------------------------------
        [Create file or folder]
        -------------------------------------------------------------------*/
        else if (isset($_POST["currentPath"]) && isset($_POST["createItem"]) && isset($_POST["createOption"])) {
            // Call WC class
            include_once("index.class.php");
            $wcObject = new WebCommander();
            // Get file/folder create options
            $currentPath = $_POST["currentPath"];
            $createItem = $_POST["createItem"];
            $createOption = $_POST["createOption"];
            // Create file/folder and send message
            echo $wcObject->createFileFolder($currentPath, $createItem, $createOption);
        }
        /*------------------------------------------------------------------
        [Delte file or folder]
        -------------------------------------------------------------------*/
        else if (isset($_POST["deleteURL"])) {
            // Call WC class
            include_once("index.class.php");
            $wcObject = new WebCommander();
            // Get item to delete
            $deleteObject = $_POST["deleteURL"];
            // Delete item and send message
            echo $wcObject->deleteFileFolder($deleteObject);
        }
        /*------------------------------------------------------------------
        [Rename file or folder]
        -------------------------------------------------------------------*/
        else if (isset($_POST["renameURL"]) && isset($_POST["renameName"])) {
            // Call WC class
            include_once("index.class.php");
            $wcObject = new WebCommander();
            // Get item to rename
            $renameItem = $_POST["renameURL"];
            $reName = $_POST["renameName"];
            // Rename item and send message
            echo $wcObject->renameFileFolder($renameItem, $reName);
        }
        /*------------------------------------------------------------------
        [Search for files]
        -------------------------------------------------------------------*/
        else if (isset($_POST["search-item"]) && isset($_POST["viewFileFolder"])) {
            // Call WC class
            include_once("index.class.php");
            $wcObject = new WebCommander();
            // Get keyword and location for search
            $searchObject = $_POST["search-item"];
            $locationObject = $_POST["viewFileFolder"];
            // Check if root directory
            $root = (isset($_POST["root-dir"])) ? "on" : "off";
            if($root == "on")
                $locationObject = $_SERVER['DOCUMENT_ROOT'];
            // Search and display result
            $wcObject->getSearchContent($searchObject, $locationObject);
        }
        /*------------------------------------------------------------------
        [Get permission content]
        -------------------------------------------------------------------*/
        else if (isset($_POST["permissionURL"])) {
            // Call WC class
            include_once("index.class.php");
            $wcObject = new WebCommander();
            // Get url for permission
            $permissionURL = $_POST["permissionURL"];
            // Get permission instance
            $wcObject->getPermissionContent($permissionURL);
        }
        /*------------------------------------------------------------------
        [Set permission content]
        -------------------------------------------------------------------*/
        else if (isset($_POST["permission_file"])) {
            // Call WC class
            include_once("index.class.php");
            $wcObject = new WebCommander();
            // Get permission variables
            $ru = (isset($_POST["ru"])) ? 4 : 0;
            $rg = (isset($_POST["rg"])) ? 4 : 0;
            $rw = (isset($_POST["rw"])) ? 4 : 0;
            $wu = (isset($_POST["wu"])) ? 2 : 0;
            $wg = (isset($_POST["wg"])) ? 2 : 0;
            $ww = (isset($_POST["ww"])) ? 2 : 0;
            $eu = (isset($_POST["eu"])) ? 1 : 0;
            $eg = (isset($_POST["eg"])) ? 1 : 0;
            $ew = (isset($_POST["ew"])) ? 1 : 0;
            // Set permission instance
            return $wcObject->setPermissionContent($_POST["permission_file"], $ru, $rg, $rw, $wu, $wg, $ww, $eu, $eg, $ew);
        }
        /*------------------------------------------------------------------
        [Unzip a file]
        -------------------------------------------------------------------*/
        else if (isset($_POST["unzipURL"])) {
            // Call WC class
            include_once("index.class.php");
            $wcObject = new WebCommander();
            // Unzip the compressed file
            if($wcObject->unzip($_POST["unzipURL"]))
                echo "Success";
        }
    }