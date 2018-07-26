<?php
class WebCommander extends Init {
	// Database connection class
	private $db_connection = null;
    /*------------------------------------------------------------------
    [Construct function to initialize environment]
    -------------------------------------------------------------------*/
	function __construct()
	{
		// Set timezone
    	date_default_timezone_set($this->time_zone);
    	// Set database connection
		$this->db_connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
		$this->db_connection->set_charset("utf8");
		// Error message if no connection
		if ($this->db_connection->connect_errno) {
			echo "Invalid configuration! Database not connedted...";
			exit();
		}
	}
    /*------------------------------------------------------------------
    [View mobile menu except copy and move buttons]
    -------------------------------------------------------------------*/
	public function viewMobileMenu()
	{
		echo <<<EOT
	        <button class="circular ui icon bars black button"> <i class="bars icon"></i> </button>
	        <div class="ui sidebar inverted vertical mobile menu">
	            <div class="top item"><img class="ui centered mini image" src="WebC/img/logo.png"></div>
	            <a class="item upload-action">Upload</a>
	            <a class="item zip-action">Zip</a>
	            <a class="item download-action">Download</a>
	            <a class="item create-action">Create</a>
	            <a class="item trash-action">Delete</a>
	            <a class="item rename-action">Rename</a>
	            <a class="item search-action">Search</a>
	        </div>
EOT;
	}
    /*------------------------------------------------------------------
    [Login screen with only password button]
    -------------------------------------------------------------------*/
	public function loginView()
	{
		echo <<<EOT
			<div class="ui middle aligned center aligned grid">
			  	<div class="column">
			    	<h3 class="circular ui image header">
			      		<img src="WebC/img/logo.png" class="ui small image">
			    	</h3>
					<form method="post" action="webc.php" name="loginform" class="ui large form">
				      	<div class="ui login segment">
				        	<div class="field">
				          		<div class="ui small login input">
							    	<input type="text" name="user_name" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"/>
				          		</div>
				        	</div>
				        	<div class="field">
				          		<div class="ui small login input">
							    	<input type="password" name="user_password" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"/>
				          		</div>
				        	</div>
							<input class="medium ui fluid green login button" type="submit"  name="login" value="Log in"/>
				      	</div>
					</form>
			  	</div>
			</div>
EOT;
	}
    /*------------------------------------------------------------------
    [Left and right sidebar to view and edit files]
    -------------------------------------------------------------------*/
	public function viewSidebar()
	{
		echo <<<EOT
	        <div class="ui left very wide display sidebar vertical menu">
	            <div class="item">
	                <button class="ui right floated compact icon left close gray button">
	                    <i class="window close red icon"></i>
	                </button>
	                <button class="ui right floated compact icon left save gray button">
	                    <i class="save blue icon"></i>
	                </button>
	                </div>
	            <div class="left-panel item">
	            </div>
	        </div>
	        <div class="ui right very wide display sidebar vertical menu">
	            <div class="item">
	                <button class="ui compact icon right close gray button">
	                    <i class="window close red icon"></i>
	                </button>
	                <button class="ui compact icon right save gray button">
	                    <i class="save blue icon"></i>
	                </button>
	            </div>
	            <div class="right-panel item">
	            </div>
	        </div>
EOT;
	}
    /*------------------------------------------------------------------
    [View top menu with icon and logout button]
    -------------------------------------------------------------------*/
	public function viewTopMenu()
	{
		echo <<<EOT
            <div class="ui inverted menu">
                <div class="item">
                    <img class="ui mini image" src="WebC/img/logo.png">
                </div>
                <div class="item">
                    Web Commander
                </div>
                <div class="right menu">
                    <div class="item mobile-device">
                        <div class="ui black info icon button"><i class="info circle icon"></i></div>
                    </div>
                    <div class="item">
                        <div class="ui black icon permission button"><i class="question circle icon"></i></div>
                    </div>
                    <div class="item">
                        <div class="ui black keyboard icon button"><i class="mobile icon"></i></div>
                    </div>
EOT;
		if ($_SESSION['user_name'] == "admin")
		echo <<<EOT
                    <div class="item">
                        <div class="ui black user icon button"><i class="smile icon"></i></div>
                    </div>
EOT;
		echo <<<EOT
                    <div class="item">
                        <a href="webc.php?logout" class="ui black logout icon button"><i class="power off icon"></i></a>
                    </div>
                </div>
            </div>
EOT;
	}
    /*------------------------------------------------------------------
    [View all modals to execute activities]
    -------------------------------------------------------------------*/
	public function viewModal()
	{
		echo <<<EOT
            <div class="ui small user modal">
                <div class="header">
                	User Access
                </div>
                <div class="scrolling content">
					<form id="new-user" class="ui tiny form">
					  	<div class="three fields">
					    	<div class="field user-name-error">
					      		<input type="text" name="user_name" id="user_name" placeholder="Username" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
					    	</div>
					    	<div class="field user-password-error">
					      		<input type="password" name="user_password_hash" id="user_password_hash" placeholder="Password" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
					    	</div>
					    	<div class="field user-access-error">
					      		<input type="text" name="user_access" id="user_access" placeholder="Access folder" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
					    	</div>
					  	</div>
	                    <div class="ui basic segment">
						  	<button class="ui right floated small green button">Save</button>
						</div>
					</form>
                    <div class="ui basic user segment">
EOT;
					// View user list with delete options
					$this->viewUserDirectory();
		echo <<<EOT
                    </div>
                </div>
                <div class="actions">
                    <div class="ui cancel small red button">Close</div>
                </div>
            </div>
            <div class="ui mini prop modal">
                <div class="header">Properties</div>
                <div class="content">
                	<a id="lnk-text" class="lnk-text"></a>
					<form id="perm-content">
					</form>
                </div>
                <div class="actions">
                    <div class="ui small green perm-content button">Set</div>
                    <div class="ui cancel small red button">Close</div>
                </div>
            </div>
            <div class="ui mini error modal">
                <div class="header">Error</div>
                <div class="content">
                    <p class="error"></p>
                </div>
                <div class="actions">
                    <div class="ui cancel small red button">Close</div>
                </div>
            </div>
            <div class="ui mini access modal">
                <div class="header">
                </div>
                <div class="content">
                    <p></p>
                </div>
                <div class="actions">
                    <div class="ui approve small green button">Copy</div>
                    <div class="ui cancel small red button">Close</div>
                </div>
            </div>
            <div class="ui mini text modal">
                <div class="header">
                </div>
                <div class="content">
                   	<p></p>
                    <div class="ui tiny form">
                        <div class="field text-entry-error">
                            <div class="ui fluid input">
                                <input id="input-text" name="input-text" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
                            </div>
                        </div>
                        <div class="field create-item hidden-content">
                            <div class="ui slider checkbox">
                                <input type="checkbox" id="dir-option" name="dir-option" tabindex="0">
                                <label>Folder</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="actions">
                    <div class="ui create small green button hidden-content"></div>
                    <div class="ui rename small green button hidden-content"></div>
                    <div class="ui cancel small red button">Close</div>
                </div>
            </div>
            <div class="ui mini upload modal">
                <div class="header">
                    Upload File
                </div>
                <div class="content">
                    <form method="post" action="" enctype="multipart/form-data" id="myform">
                        <div class="ui demo-upload">
                            <input type="file" id="file_upload" name="file_upload" class="input-upload"/>
                            <p>Click to upload file...</p>
                        </div>
                    </form>
                </div>
                <div class="actions">
                    <div class="ui small green send-upload button">Upload</div>
                    <div class="ui cancel small red button">Close</div>
                </div>
            </div>
            <div class="ui tiny search modal">
                <div class="header">
                </div>
                <div class="scrolling content">
                    <form id="search-form" class="ui tiny form">
                        <div class="field search-entry-error">
                            <input placeholder="Search" id="search-item" name="search-item" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
                        </div>
                        <div class="field">
                            <div class="ui slider checkbox">
                                <input type="checkbox" id="root-dir" name="root-dir" tabindex="0">
                                <label>Root-dir</label>
                            </div>
                            <input type="submit" class="ui submit compact green find-start button" value="Search">
                        </div>
                    </form>
                    <div class="ui basic result segment">
                    </div>
                </div>
                <div class="actions">
                    <div class="ui cancel small red find-close button">Close</div>
                </div>
            </div>
            <div class="ui mini info modal">
                <div class="header">App Info</div>
                <div class="content">
                    <h4 class="ui dividing header">
                        Web Commander 1.0
                        <div class="sub header"><div class="green">Rashed Hasan</div><a href="codingtrend.ca" target="_blank">https://rashedhasan.ca/</a></div>
                    </h4>
                </div>
                <div class="actions">
                    <div class="ui cancel tiny red button">Close</div>
                </div>
            </div>
EOT;
	}
    /*------------------------------------------------------------------
    [View keyboard menu]
    -------------------------------------------------------------------*/
	public function showKeyboard()
	{
        echo <<<EOT
			<div class="ui compact vertical labeled icon menu hidden-content">
			  	<a class="item key-up">
			    	<i class="chevron circle up icon"></i>
			    	Up
			  	</a>
			  	<a class="item key-switch mobile-device">
			    	<i class="exchange icon"></i>
			    	Switch
			  	</a>
			  	<a class="item key-down">
			   	 	<i class="chevron circle down icon"></i>
			    	Down
			  	</a>
			</div>
EOT;
	}
    /*------------------------------------------------------------------
    [View all buttons in large and medium screen]
    -------------------------------------------------------------------*/
	public function showBottomMenu()
	{
        echo <<<EOT
			<div class="nine ui black compact buttons mobile-device">
				<div class="ui vertical animated copy-action button" tabindex="0">
				  	<div class="hidden content"><i class="clone outline icon"></i></div>
				  	<div class="visible content">Copy</div>
				</div>
				<div class="ui vertical animated move-action button" tabindex="0">
				  	<div class="hidden content"><i class="angle double right icon"></i></div>
				  	<div class="visible content">Move</div>
				</div>
				<div class="ui vertical animated upload-action button" tabindex="0">
				  	<div class="hidden content"><i class="upload icon"></i></div>
				  	<div class="visible content">Upload</div>
				</div>
				<div class="ui vertical animated zip-action button" tabindex="0">
				  	<div class="hidden content"><i class="file archive outline icon"></i></div>
				  	<div class="visible content">Zip</div>
				</div>
				<div class="ui vertical animated download-action button" tabindex="0">
				  	<div class="hidden content"><i class="download icon"></i></div>
				  	<div class="visible content">Download</div>
				</div>
				<div class="ui vertical animated create-action button" tabindex="0">
				  	<div class="hidden content"><i class="file alternate outline icon"></i></div>
				  	<div class="visible content">Create</div>
				</div>
				<div class="ui vertical animated trash-action button" tabindex="0">
				  	<div class="hidden content"><i class="trash alternate outline icon"></i></div>
				  	<div class="visible content">Delete</div>
				</div>
				<div class="ui vertical animated rename-action button" tabindex="0">
				  	<div class="hidden content"><i class="edit outline icon"></i></div>
				  	<div class="visible content">Rename</div>
				</div>
				<div class="ui vertical animated search-action button" tabindex="0">
				  	<div class="hidden content"><i class="search plus icon"></i></div>
				  	<div class="visible content">Search</div>
				</div>
			</div>
EOT;
	}
    /*------------------------------------------------------------------
    [View user directory]
    -------------------------------------------------------------------*/
	public function viewUserDirectory()
	{
		echo <<<EOT
			<table class="ui very basic very compact table">
				<thead>
					<tr class="center aligned">
						<th class="four wide">User</th>
						<th class="eight wide">Access</th>
						<th class="four wide">Delete</th>
					</tr>
				</thead>
		        <tbody>
EOT;
			// Get users list from database
            if (!$this->db_connection->connect_errno) {
                $sql = "SELECT * FROM users";
                $query_check_users = $this->db_connection->query($sql);
                // Get user id, name, access folder
			    while($row = $query_check_users->fetch_assoc()) {
			    	$user_id = $row["user_id"];
			    	$user_name = $row["user_name"];
			    	$user_access = $row["user_access"];
		echo <<<EOT
					<tr id="user-$user_id" class="center aligned">
						<td>$user_name</td>
						<td>$user_access</td>
						<td>
EOT;
						// Disable delete id if admin
						if ($user_id == 1)
		echo <<<EOT
							<button class="tiny ui compact icon orange button disabled">
							  	<i class="times icon"></i>
							</button>
EOT;
						// Show delete button with delete option
						else
		echo <<<EOT
							<button id="delete-$user_id" class="tiny ui compact icon orange button user-delete">
							  	<i class="times icon"></i>
							</button>
EOT;
		echo <<<EOT
						</td>
					</tr>
EOT;
    			}
            }
		echo <<<EOT
		        </tbody>
			</table>
EOT;
	}
    /*------------------------------------------------------------------
    [Check if a user exists]
    -------------------------------------------------------------------*/
	public function checkUserExists($user_name)
	{
		if (!$this->db_connection->connect_errno) {
			$sql = "SELECT * FROM users WHERE user_name = '" . $user_name . "';";
			$query_check_user_name = $this->db_connection->query($sql);
			// Return true if user exists
			if ($query_check_user_name->num_rows == 1)
				return true;
			// Else return false
			else
				return false;
		}
	}
    /*------------------------------------------------------------------
    [Insert new user in table]
    -------------------------------------------------------------------*/
	public function insertUser($user_name, $user_password_hash, $user_access)
	{
		if (!$this->db_connection->connect_errno) {
			// Hash and salt password
			$user_password_hash = password_hash($user_password_hash, PASSWORD_DEFAULT);
			// Insert user in table
			$sql = "INSERT INTO users (user_name, user_password_hash, user_access)
				VALUES('" . $user_name . "', '" . $user_password_hash . "', '" . $user_access . "');";
			$new_user_insert = $this->db_connection->query($sql);
			if ($new_user_insert)
				return true;
			else
				return false;
		}
	}
    /*------------------------------------------------------------------
    [Update user in table]
    -------------------------------------------------------------------*/
	public function updateUser($user_name, $user_password_hash)
	{
		if (!$this->db_connection->connect_errno) {
			// Hash and salt password
			$user_password_hash = password_hash($user_password_hash, PASSWORD_DEFAULT);
			// Update admin in table
			$sql = "UPDATE users SET user_password_hash = '" . $user_password_hash . "' WHERE user_name = '" . $user_name . "';";
			$new_user_update = $this->db_connection->query($sql);
			if ($new_user_update)
				return true;
			else
				return false;
		}
	}
    /*------------------------------------------------------------------
    [Delete user in table]
    -------------------------------------------------------------------*/
	public function deleteUser($user_id)
	{
		if (!$this->db_connection->connect_errno) {
			// Delete user from table
			$sql = "DELETE FROM users WHERE user_id = '" . $user_id . "';";
			$query_user_delete = $this->db_connection->query($sql);
			if ($query_user_delete)
				return "Success";
			else
				return "Fail";
		}
	}
    /*------------------------------------------------------------------
    [Launch window segments on window load]
    -------------------------------------------------------------------*/
	public function viewWindowSegments()
	{
		// Get root directory - all if 'localhost' or the permitted folder
        $root_directory = ($_SESSION['user_access'] == "localhost") ? $_SERVER['DOCUMENT_ROOT'] : $_SESSION['user_access'];
		echo <<<EOT
            <div class="ui horizontal segments">
                <div class="ui segment one" id="segment-one">
EOT;
					// Show left window
					$this->showWindow($root_directory, "one");
		echo <<<EOT
                </div>
                <div class="ui segment two" id="segment-two">
EOT;
					// Show right window
					$this->showWindow($root_directory, "two");
		echo <<<EOT
                </div>
            </div>
EOT;
	}
    /*------------------------------------------------------------------
    [View root/folder content inside window on load and ajax call]
    -------------------------------------------------------------------*/
	public function showWindow($view_directory, $window)
	{
		$counter_window = 0;
		$object_path = "/";
		// Prepare display path to show at the top - relative to domain name
		$display_path = $view_directory;
		if ($_SESSION['user_access'] != "localhost")
			$display_path = str_replace($_SESSION['user_access'], "<u>" . $_SESSION['user_access'] . "</u>", $display_path);
		else
			$display_path = str_replace($_SERVER['DOCUMENT_ROOT'], "<u>" . $_SERVER['DOCUMENT_ROOT'] . "</u>", $display_path);
		$display_path = str_replace($_SERVER['DOCUMENT_ROOT'], $this->getURL(), $display_path);
		// View relative path of root or folder
		echo "<div class='big ui fluid label'>" . $display_path . "</div>";
		// Absolute path of root or folder to for user action in the window
		echo "<input type='hidden' id='" . $window . "-window' name='" . $window . "-window' value='" . $view_directory . "'>" ;
		$object_path = $view_directory . $object_path;
		// View folder/file table head
		echo <<<EOT
    		<table class="ui bery basic very compact unstackable table">
        		<thead>
					<tr class="left aligned">
						<th class="ten wide">File Name</th>
						<th class="two wide tiny-device">Size</th>
						<th class="four wide tablet-device">Last Edited</th>
					</tr>
				</thead>
				<tbody>
EOT;
		// Track root directory for first row
		$root_directory = ($_SESSION['user_access'] == "localhost") ? $_SERVER['DOCUMENT_ROOT'] : $_SESSION['user_access'];
		$counter_window++;
		// View and create access to root directory
        echo <<<EOT
    		<tr class="left aligned itemObject" data-url="$root_directory" data-type="type-folder" id="$window-$counter_window">
      			<td><i class="folder icon"></i>.</td>
      			<td class="tiny-device"></td>
      			<td class="tablet-device"></td>
    		</tr>
EOT;
		// Track up directory for second row
		$root_directory = $view_directory;
		$counter_window++;
		if ($_SESSION['user_access'] == "localhost") {
			if($root_directory != $_SERVER['DOCUMENT_ROOT']) {
				// Trim current directory
				$root_directory = substr($root_directory, 0, strrpos($root_directory, "/"));
			}
		}
		else if ($_SESSION['user_access'] != "localhost") {
			if (strlen($root_directory) > strlen($_SESSION['user_access'])) {
				// Trim current directory
				$root_directory = substr($root_directory, 0, strrpos($root_directory, "/"));
			}
		}
		// View and create access to up directory
        echo <<<EOT
    		<tr class="left aligned itemObject" data-url="$root_directory" data-type="type-folder" id="$window-$counter_window">
      			<td><i class="folder icon"></i>..</td>
      			<td class="tiny-device"></td>
      			<td class="tablet-device"></td>
    		</tr>
EOT;
		// Fetch all files and folders in a directory
		$fileList = glob($view_directory.'/*');
		// Fetch ./hidden files in a directory
		$dotList = glob($view_directory.'/.*');
		// Merge ./hidden files with all files and folders
		foreach ($dotList as $dotName) {
		    if(is_file($dotName)) {
		        array_push($fileList, $dotName);
		    }
		}
		// View all folders in the directory
		foreach($fileList as $filename) {
			// Check if item is a folder
		    if(is_dir($filename)) {
		        $counter_window++;
		        // Get folder size in bites
		        $folderSize = $this->getFolderSize($filename);
		        // Calculate folder size in terms of b, Kb, Mb, Gb and Tb
			    $size_counter = 0;
			    while($folderSize > 1024) {
			    	$size_counter++;
			    	$folderSize = $folderSize/1024;
			    }
			    if($size_counter == 0)
			    	$folderSize = number_format($folderSize, 1) . " <small>B</small>";
			    elseif($size_counter == 1)
			    	$folderSize = number_format($folderSize, 1) . " <small>KB</small>";
			    elseif($size_counter == 2)
			    	$folderSize = number_format($folderSize, 1) . " <small>MB</small>";
			    elseif($size_counter == 3)
			    	$folderSize = number_format($folderSize, 1) . " <small>GB</small>";
			    elseif($size_counter == 4)
			    	$folderSize = number_format($folderSize, 1) . " <small>TB</small>";
			        $filename = str_replace($view_directory."/", "", $filename);
		// View folder information in terms of table entry
        echo <<<EOT
    		<tr class="left aligned itemObject" data-url="$object_path$filename" data-type="type-folder" id="$window-$counter_window">
      			<td><i class="folder icon"></i>$filename</td>
      			<td class="tiny-device">$folderSize</td>
      			<td class="tablet-device"></td>
    		</tr>
EOT;
    		}   
		}
		// View all files in the directory
		foreach($fileList as $filename) {
			// Check if item is a file
		    if(!is_dir($filename)) {
		    	// Mark if a file is editable
			    if ($this->is_text($filename) == true) {
			    	$file_icon = "<i class='code icon'></i>";
			    	$file_type = "edit-file";
			    }
			    // Mark if a file is an image
			    else if($this->checkImage($filename)) {
			    	$file_icon = "<i class='file image outline icon'></i>";
			    	$file_type = "view-file";
			    }
			    // Mark if a file is a compressed file
			    else if($this->checkZip($filename)) {
			    	$file_icon = "<i class='file archive outline icon'></i>";
			    	$file_type = "zip-file";
			    }
			    // Mark unrecognized file formats
			    else {
			    	$file_icon = "<i class='file outline icon'></i>";
			    	$file_type = "null-file";
			    }
			    // Get formatted file size
			    $file_size = $this->getFileSize($filename);
			    // Get formatted last edited datetime
			    $file_date = date("d-M'y H:i",filemtime($filename));
			    $counter_window++;
			    $filename = str_replace($view_directory."/", "", $filename);
		// View file information in terms of table entry
        echo <<<EOT
    		<tr class="left aligned itemObject" data-url="$object_path$filename" data-type="$file_type" id="$window-$counter_window">
      			<td>$file_icon$filename</td>
      			<td class="tiny-device">$file_size</td>
      			<td class="tablet-device">$file_date</td>
    		</tr>
EOT;
    		}   
		}
		// Closing table entry and add window information
        echo <<<EOT
		  		</tbody>
			</table>
			<input type="hidden" name="$window-count" id="$window-count" value="$counter_window">
EOT;
	}
    /*------------------------------------------------------------------
    [Get domain URL to display window top]
    -------------------------------------------------------------------*/
	private function getURL()
	{
	    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
	    $domainName = $_SERVER['HTTP_HOST'].'/';
	    return $protocol . substr_replace($domainName, "", -1);
	}
    /*------------------------------------------------------------------
    [Check if file is readable from Init array]
    -------------------------------------------------------------------*/
	private function checkReadableFile($file_name)
	{
		if (in_array($file_name, $this->file_extension))
			return true;
		else 
			return false;
	}
    /*------------------------------------------------------------------
    [Check if file is editable]
    -------------------------------------------------------------------*/
	private function is_text($filename)
	{
		// Call SPL class
		$spl = new SplFileInfo($filename);
		// Make file editable if matches
		if(($this->checkReadableFile("." . $spl->getExtension()) !== false && trim($spl->getExtension()) !== "")
			|| $this->checkReadableFile(basename($filename)) !== false ){
			fclose($file);
			return true;
		}
		// Make file un-editable if doesn't match
		return false;
	}
    /*------------------------------------------------------------------
    [Check if a file is an image]
    -------------------------------------------------------------------*/
	private function checkImage($filename)
	{
		$spl = new SplFileInfo($filename);
		// Suported extensions of images
		$image = array("bmp", "jpg", "jpeg", "png", "svg", "ico");
		// Make file viewable if image
		if (in_array($spl->getExtension(), $image))
			return true;
		// Make unviewable if not image
		else
			return false;
	}
    /*------------------------------------------------------------------
    [Check if a file is a compressed file]
    -------------------------------------------------------------------*/
	private function checkZip($filename)
	{
		$spl = new SplFileInfo($filename);
		// Supported extension of compressed file
		$zip = array("zip");
		// Mark a file as zip if compressed
		if (in_array($spl->getExtension(), $zip))
			return true;
		// Mark not zip if not comrpessed
		else
			return false;
	}
    /*------------------------------------------------------------------
    [Return size of a directory]
    -------------------------------------------------------------------*/
	private function getFolderSize($dir)
	{
	    $size = 0;
	    // Get all files/folders in a directory
		$fileList = glob($dir.'/*');
		$dotList = glob($dir.'/.*');
		foreach ($dotList as $dotName) {
		    if(is_file($dotName)) {
		        array_push($fileList, $dotName);
		    }
		}
		// Add folder size recursively
	    foreach ($fileList as $each) {
	        $size += is_file($each) ? filesize($each) : $this->getFolderSize($each);
	    }
	    return $size;
	}
    /*------------------------------------------------------------------
    [Return formatted size of a file]
    -------------------------------------------------------------------*/
	public function getFileSize($filename)
	{
		// Get file size
		$file_size = filesize($filename);
		$size_counter = 0;
		while($file_size > 1024) {
		    $size_counter++;
		    $file_size = $file_size/1024;
		}
		// Format fize size and return
		if($size_counter == 0)
			$file_size = number_format($file_size, 1) . " <small>B</small>";
		elseif($size_counter == 1)
			$file_size = number_format($file_size, 1) . " <small>KB</small>";
		elseif($size_counter == 2)
			$file_size = number_format($file_size, 1) . " <small>MB</small>";
		elseif($size_counter == 3)
			$file_size = number_format($file_size, 1) . " <small>GB</small>";
		elseif($size_counter == 4)
			$file_size = number_format($file_size, 1) . " <small>TB</small>";
		return $file_size;
	}
	/*------------------------------------------------------------------
	[Get file content for editing]
	-------------------------------------------------------------------*/
	public function getFileContent($file_url)
	{
		// Open and read file content
		$file = fopen($file_url,"r");
		$content = fread($file, filesize($file_url));
		fclose($file);
		// Return file content
		return htmlentities($content);
	}
	/*------------------------------------------------------------------
	[Get image content for viewing]
	-------------------------------------------------------------------*/
	public function getImageContent($image_url)
	{
		// Return image url
		return str_replace($_SERVER['DOCUMENT_ROOT'], $this->getURL(), $image_url);
	}
    /*------------------------------------------------------------------
    [Copy file to other window location]
    -------------------------------------------------------------------*/
	public function copyFileToFolder($copyFile, $dest_folder)
	{
		// Check if file already exists and delete to overwrite
		if (file_exists($dest_folder."/".basename($copyFile)))
			$this->delFile($dest_folder."/".basename($copyFile));
		// Copy file in destination folder
		copy($copyFile, $dest_folder."/".basename($copyFile));
	}
    /*------------------------------------------------------------------
    [Copy folder to other window location]
    -------------------------------------------------------------------*/
	public function copyFolderToFolder($src, $dst) { 
		$fileList = glob($src.'/*');
		$dotList = glob($src.'/.*');
		foreach ($dotList as $dotName) {
		    if(is_file($dotName)){
		        array_push($fileList, $dotName);
		    }
		}
		foreach($fileList as $filename){
			// Copy if object is a file
		    if(!is_dir($filename))
		    	$this->copyFileToFolder($filename, $dst);
		    // If not file, create folder and iterate
			else {
				@mkdir($dst."/".basename($filename));
				$this->copyFolderToFolder($src."/".basename($filename), $dst."/".basename($filename));
			}
		}
	}
    /*------------------------------------------------------------------
    [Delete file link]
    -------------------------------------------------------------------*/
	public function delFile($file) { 
		// Set permission to file to delete
	    chmod($file, 0777);
	   	unlink($file);
  	} 
    /*------------------------------------------------------------------
    [Delete folder]
    -------------------------------------------------------------------*/
	public function delTree($dir) { 
		// Scan directory for file and folder
	   	$files = array_diff(scandir($dir), array('.','..')); 
	    foreach ($files as $file) { 
	    	// Delete if file, iterate if folder
	      	(is_dir("$dir/$file")) ? $this->delTree("$dir/$file") : $this->delFile("$dir/$file"); 
	    } 
	    // Set permission to folder to delete
	    chmod($dir, 0777);
	    return rmdir($dir); 
  	} 
    /*------------------------------------------------------------------
    [Save file content to url]
    -------------------------------------------------------------------*/
  	public function saveFileContent($file_content, $url) {
  		// Rewrite permission for the file to write
  		chmod($url, 0777);
  		// Open url file to write
		$file = fopen($url,"w");
		// Write content in file
		fwrite($file, rawurldecode($file_content));
		// Close file after writing
		fclose($file);
  	}
    /*------------------------------------------------------------------
    [Upload file in location]
    -------------------------------------------------------------------*/
  	public function uploadFile($filename, $location) {
  		// Delete if file already exists
  		if(file_exists($location))
	  		$this->delFile($location);
  		// Upload file and send success message
		if(move_uploaded_file($filename, $location)){
			echo "Success";
		// Send error if unsuccessful
		} else{
			echo "Error";
		}
  	}
    /*------------------------------------------------------------------
    [Compress a file or folder - https://gist.github.com/MarvinMenzerath/4185113]
    -------------------------------------------------------------------*/
	public function zipData($source, $destination) {
  		// Delete if file already exists
  		if(file_exists($destination))
	  		$this->delFile($destination);
	  	// Proceed with file compression
        if (extension_loaded('zip')) {
            if (file_exists($source)) {
                $zip = new ZipArchive();
                if ($zip->open($destination, ZIPARCHIVE::CREATE)) {
                    $source = realpath($source);
                    if (is_dir($source)) {
                        $iterator = new RecursiveDirectoryIterator($source);
                        $iterator->setFlags(RecursiveDirectoryIterator::SKIP_DOTS);
                        $files = new RecursiveIteratorIterator($iterator, RecursiveIteratorIterator::SELF_FIRST);
                        foreach ($files as $file) {
                            $file = realpath($file);
                            if (is_dir($file)) {
                                $zip->addEmptyDir(str_replace($source . '/', '', $file . '/'));
                            } else if (is_file($file)) {
                                $zip->addFromString(str_replace($source . '/', '', $file), file_get_contents($file));
                            }
                        }
                    } else if (is_file($source)) {
                        $zip->addFromString(basename($source), file_get_contents($source));
                    }
                }
                return $zip->close();
            }
        }
        return false;
	}
    /*------------------------------------------------------------------
    [Create download instance in modal]
    -------------------------------------------------------------------*/
	public function downloadFile($downloadSource)
	{
        // Convert the file to downloadable link
		return str_replace($_SERVER['DOCUMENT_ROOT'], $this->getURL(), $downloadSource);
	}
    /*------------------------------------------------------------------
    [Create file or folder]
    -------------------------------------------------------------------*/
	public function createFileFolder($currentPath, $createItem, $createOption)
	{
		// Create if folder
		if($createOption == "false") {
			// Error message if file exists
			if (file_exists($currentPath . "/" . $createItem))
				return "File already exists...";
			// Create file otherwise
			$file = fopen($currentPath . "/" . $createItem, "w");
			fclose($file);
			return "File created successfully...";
		}
		// Create if file
		else {
			// Error message if folder exists
			if (file_exists($currentPath . "/" . $createItem))
				return "Folder already exists...";
			// Create folder otherwise
			@mkdir($currentPath . "/" . $createItem, 0777);
			return "Folder created successfully...";
		}
	}
    /*------------------------------------------------------------------
    [Delete file or folder]
    -------------------------------------------------------------------*/
	public function deleteFileFolder($deleteObject)
	{
		// Delete if item is file
		if(!is_dir($deleteObject)) {
            $this->delFile($deleteObject);
			return "File deleted successfully...";
        }
        // Delete if item is folder
        else {
            $this->delTree($deleteObject);
            return "Folder deleted successfully...";
        }

	}
    /*------------------------------------------------------------------
    [Rename file or folder]
    -------------------------------------------------------------------*/
	public function renameFileFolder($renameItem, $reName)
	{
        // Return if file already exists
		if (file_exists(substr($renameItem, 0, strrpos($renameItem, "/")) . "/" . $reName) && !is_dir(substr($renameItem, 0, strrpos($renameItem, "/")) . "/" . $reName))
			return "File already exists...";
        // Return if folder already exists
		else if (file_exists(substr($renameItem, 0, strrpos($renameItem, "/")) . "/" . $reName) && is_dir(substr($renameItem, 0, strrpos($renameItem, "/")) . "/" . $reName))
			return "Folder already exists...";
        // Rename if item is file
        if(!is_dir($renameItem)) {
           	chmod($renameItem, 0777);
            rename($renameItem, substr($renameItem, 0, strrpos($renameItem, "/")) . "/" . $reName);
            return "File renamed successfully...";
        }
        // Rename if item is folder
        else if(is_dir($renameItem)) {
           	chmod($renameItem, 0777);
            rename($renameItem, substr($renameItem, 0, strrpos($renameItem, "/")) . "/" . $reName);
            return "Folder renamed successfully...";
        }
	}
    /*------------------------------------------------------------------
    [Search for file]
    -------------------------------------------------------------------*/
	public function getSearchContent($src, $dst)
	{
		// Get files and folders in the directory
		$fileList = glob($dst.'/*');
		$dotList = glob($dst.'/.*');
		foreach ($dotList as $dotName) {
		    if(is_file($dotName)){
		        array_push($fileList, $dotName);
		    }
		}
		foreach($fileList as $filename){
			// If file and matched, send output
		    if(!is_dir($filename)) {
				if(strpos(strtolower(basename($filename)), strtolower($src)) !== false)
					echo "<p>" . $filename . "</p>";
		    }
		    // If folder, send reccurance search
		    else
				$this->getSearchContent($src, $filename);
		}
	}
    /*------------------------------------------------------------------
    [Get file permission levels]
    -------------------------------------------------------------------*/
	public function getPermissionContent($permissionURL)
	{
		// Read file permission
		$perms = fileperms($permissionURL);
		// Get seperate read-write permissions
		$ru = (($perms & 0x0100) ? 'checked' : '-');
		$rg = (($perms & 0x0020) ? 'checked' : '-');
		$rw = (($perms & 0x0004) ? 'checked' : '-');
		$wu = (($perms & 0x0080) ? 'checked' : '-');
		$wg = (($perms & 0x0010) ? 'checked' : '-');
		$ww = (($perms & 0x0002) ? 'checked' : '-');
		$eu = (($perms & 0x0040) ?
			(($perms & 0x0800) ? 'checked' : 'checked' ) :
		    (($perms & 0x0800) ? 'checked' : '-'));
		$eg = (($perms & 0x0008) ?
			(($perms & 0x0400) ? 'checked' : 'checked' ) :
		            (($perms & 0x0400) ? 'checked' : '-'));
		$ew = (($perms & 0x0001) ?
			(($perms & 0x0200) ? 'checked' : 'checked' ) :
			(($perms & 0x0200) ? 'checked' : '-'));
		// View permissions in a table
        echo <<<EOT
			<table class="ui very basic very compact unstackable table">
				<thead>
					<tr class="center aligned">
						<th>Mode</th>
						<th>User</th>
						<th>Group</th>
						<th>World</th>
					</tr>
				</thead>
		        <tbody>
		        	<input type="hidden" id="permission_file" name="permission_file" value="$permissionURL">
					<tr class="center aligned">
						<th>Read</th>
						<td><div class="ui checkbox"><input type="checkbox" id="ru" name="ru" $ru><label></label></div></td>
						<td><div class="ui checkbox"><input type="checkbox" id="rg" name="rg" $rg><label></label></div></td>
						<td><div class="ui checkbox"><input type="checkbox" id="rw" name="rw" $rw><label></label></div></td>
					</tr>
					<tr class="center aligned">
						<th>Write</th>
						<td><div class="ui checkbox"><input type="checkbox" id="wu" name="wu" $wu><label></label></div></td>
						<td><div class="ui checkbox"><input type="checkbox" id="wg" name="wg" $wg><label></label></div></td>
						<td><div class="ui checkbox"><input type="checkbox" id="ww" name="ww" $ww><label></label></div></td>
					</tr>
					<tr class="center aligned">
						<th>Execute</th>
						<td><div class="ui checkbox"><input type="checkbox" id="eu" name="eu" $eu><label></label></div></td>
						<td><div class="ui checkbox"><input type="checkbox" id="eg" name="eg" $eg><label></label></div></td>
						<td><div class="ui checkbox"><input type="checkbox" id="ew" name="ew" $ew><label></label></div></td>
					</tr>
		        </tbody>
			</table>
EOT;
	}
    /*------------------------------------------------------------------
    [Set file permission levels]
    -------------------------------------------------------------------*/
	public function setPermissionContent($permission_file, $ru, $rg, $rw, $wu, $wg, $ww, $eu, $eg, $ew)
	{
		// Prepare permission variable
		$user = $ru + $wu + $eu;
		$group = $rg + $wg + $eg;
		$world = $rw + $ww + $ew;
		// Return error if all unset
		if($user + $group + $world == 0) {
			echo "Failed";
		}
		// Set the permission level
		else {
			chmod($permission_file, octdec(intval((string) $user . (string) $group . (string) $world)));
			echo "Success";
		}
	}
    /*------------------------------------------------------------------
    [Unzip compressed file]
    -------------------------------------------------------------------*/
	public function unzip($zip_path) { 
	   	$dir_path = str_replace(".zip", "", $zip_path); 
	   	$zip_error = 0; 
	   	if (file_exists($zip_path)) { 
	   		// Create a folder to protect existing files from
	        if (!file_exists($dir_path)) { 
	            @mkdir($dir_path, 0777);    
		        if (($link = zip_open($zip_path))) { 
		            while (($zip_entry = zip_read($link)) && (!$zip_error)) { 
		               	if (zip_entry_open($link, $zip_entry, "r")) { 
		                  	$data = zip_entry_read($zip_entry, zip_entry_filesize($zip_entry)); 
		                  	$dir_name = dirname(zip_entry_name($zip_entry)); 
		                  	$name = zip_entry_name($zip_entry); 
		                  	if ($name[strlen($name)-1] == '/') { 
		                        $base = "$dir_path/"; 
		                    	foreach ( explode("/", $name) as $k) { 
		                        	$base .= "$k/"; 
		                        	if (!file_exists($base)) 
		                           	@mkdir($base, 0777); 
		                     	}    
		                	} 
			                else {
			                	// Create the directory for unzipped files
			                    $name = utf8_decode("$dir_path/$name"); 
			                   	@mkdir(str_replace(basename($name), "", $name), 0777);
			                   	// Write the files in the directory
			                    $stream = fopen($name, "w"); 
			                    fwrite($stream, $data);
			                    fclose($stream); 
			                }  
			                zip_entry_close($zip_entry); 
			            } 
			        } 
		            zip_close($link);  
		        } 
	       	} 
	    } 
		return true;        
	}
}
