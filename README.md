# WebCommander
<p>Ajax file management system - an alternative design. A GUI to manage web files easily.</p>

# Resource Requirement
<ul class="ui list">
  <li>Php 5.5+, Mysql, jQuery, html5</li>
  <li>Php.ini configuration to manage large file(s) -
    <ul>
      <li>max_execution_time - 120+,</li>
      <li>memory_limit - 512M+,</li>
      <li>post_max_size - 512M+,</li>
      <li>upload_max_filesize - 512M+,</li>
      <li>Or the highest available limits. Working with large files without setting these parameters might result in data loss.</li>
      <li>Also check for any firewall restrictions by hosting provider before working with larger file/folders.</li>
    </ul>
  </li>
  <li>Browsers - 
    <ul>
      <li>Chrome, Safari, Edge, Firefox, IE, Opera.</li>
      <li>All latest versions recommended.</li>
    </ul>
  </li>
</ul>

# Installation
<ul class="ui list">
  <li>Copy all the files and folders in root directory of your domain. Few features might not work if copied in folders/sub-directories.</li>
  <li>Create a db - webc and upload webc.sql in the database.</li>
  <li>Edit config.php for initialization -
   <ul>
    <li>Define DB_HOST, DB_NAME, DB_USER and DB_PASS to connect mysql</li>
    <li>Initilize $time_zone to adjust as per your timezone. The default is America/Toronto.</li>
    <li>Add file names or extensions in $file_extension array() to edit the file types you want. The system check if the file is editable first, then takes these declarations under consideration.</li>
  </ul>
  </li>
</ul>

# Usage

<ul class="ui list">
                <li>Login with username - admin and password - canada initially.</li>
                <li>Navigation -
                    <ul>
                        <li>Use up/down arrow keys to navigate files/folders in same window, tab to switch between windows.</li>
                        <li>Use right mouse click to select file/folder.</li>
                        <li>Switch navigation buttons from top menu to navigate in mobile devices.</li>
                        <li>Press enter or left mouse click to edit text file, view image, expand folder and unzip compressed files.</li>
                        <li>Enter (.) folder to navigate to root directory, (..) for upper directory.</li>
                    </ul>
                </li>
                <li>Edit text file -
                    <ul>
                        <li>Files with <i class="code icon"></i> icon are editable.</li>
                        <li>Click the save button at the upper panel of the editing area to save files. You will be notified before closing if not saved.</li>
                    </ul>
                </li>
                <li>Viewing image -
                    <ul>
                        <li>Images with <i class="file image outline icon"></i> icon can be viewed.</li>
                        <li>No editing or zooming can be done with the images.</li>
                        <li>This application does not support video formats.</li>
                    </ul>
                </li>
                <li>Copy - only works in desktop device, file or folder are copied in opposite window.</li>
                <li>Move - only works in desktop device, file or folder are moved to opposite window.</li>
                <li>Upload - uploads file in the selected window/directory.</li>
                <li>Zip - compresses selected file/folder in the selected window/directory.</li>
                <li>Download - downloads only selected zip files.</li>
                <li>Create - creates new file in the selected window/directory. Creates folder if 'Folder' option enabled.</li>
                <li>Delete - deletes selected file/folder in the selected window/directory.</li>
                <li>Rename - renames selected file/folder in the selected window/directory.</li>
                <li>Search - searches a file in the selected window/directory, if 'Root-dir' option enabled it searches from root directory.</li>
                <li>Top menu options -
                    <ul>
                        <li><i class="question circle icon"></i> - views and sets file/folder access permission of the selected item.</li>
                        <li><i class="mobile icon"></i> - switches navigation buttons on/off for mobile devices.</li>
                        <li><i class="smile icon"></i> - user access.</li>
                    </ul>
                </li>
                <li>User access -
                    <ul>
                        <li>To change admin password, put username - admin and new password.</li>
                        <li>Add new user by putting new username and password and access location.</li>
                        <li>localhost (lowercase) as access location gives acccess to root directory. For restricted access give the absolute path (can be found in folder set permission modal) like - '/home/abcdef/public_html/Folder', etc.</li>
                        <li>Additional users cannot login if the access folder doesn't exist.</li>
                    </ul>
                </li>
            </ul>

# License
MIT @ <a href="https://rashedhasan.ca">Rashed Hasan</a>
