<?php
class Login
{
    /*------------------------------------------------------------------
    [Initialize login class]
    -------------------------------------------------------------------*/
    public function __construct()
    {
        // Create/read session, absolutely necessary
        ini_set("session.cookie_httponly", 1);
        session_start();
        // If user tried to log out (happen when user clicks logout button)
        if (isset($_GET["logout"])) {
            $this->doLogout();
        }
        // Login via post data (if user just submitted a login form)
        elseif (isset($_POST["login"])) {
            $this->dologinWithPostData();
        }
    }
    /*------------------------------------------------------------------
    [Login with post data]
    -------------------------------------------------------------------*/
    private function dologinWithPostData()
    {
        // Check login form contents
        if (empty($_POST['user_name']) || empty($_POST['user_password'])) {
            $this->errors[] = "Password field was empty.";
        } elseif (!empty($_POST['user_name']) && !empty($_POST['user_password'])) {
            // Create a database connection, using the constants from config.php
            $this->db_connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
            // Change character set to utf8 and check it
            if (!$this->db_connection->set_charset("utf8")) {
                $this->errors[] = $this->db_connection->error;
            }
            // If no connection errors (= working database connection)
            if (!$this->db_connection->connect_errno) {
                // Escape the POST stuff
                $user_name = $this->db_connection->real_escape_string($_POST['user_name']);
                $user_password = $this->db_connection->real_escape_string($_POST['user_password']);
                // Database query, getting all the info of the selected user
                $sql = "SELECT user_name, user_password_hash, user_access
                        FROM users
                        WHERE user_name = '" . $user_name . "';";
                $result_of_login_check = $this->db_connection->query($sql);
                // If this user exists
                if ($result_of_login_check->num_rows == 1) {
                    // Get result row as an object
                    $result_row = $result_of_login_check->fetch_object();
                    // Using PHP 5.5's password_verify() function to check if the password is ok
                    if (password_verify($user_password, $result_row->user_password_hash)) {
                        // Write user data into PHP SESSION
                        $_SESSION['user_name'] = $result_row->user_name;
                        // Get user access actual folder
                        $_SESSION['user_access'] = ($result_row->user_access == "localhost") ? $_SERVER['DOCUMENT_ROOT'] : $result_row->user_access;
                        $_SESSION['user_login_status'] = 1;
                    } else {
                        $this->errors[] = "Wrong password. Try again.";
                    }
                } else {
                    $this->errors[] = "This user does not exist.";
                }
            }
        }
    }
    /*------------------------------------------------------------------
    [Perform the logout]
    -------------------------------------------------------------------*/
    public function doLogout()
    {
        // Delete the session of the user
        $_SESSION = array();
        session_destroy();
    }
    /*------------------------------------------------------------------
    [Return the current state of user login]
    -------------------------------------------------------------------*/
    public function isUserLoggedIn()
    {
        if (isset($_SESSION['user_login_status']) AND $_SESSION['user_login_status'] == 1) {
            return true;
        }
        // default return
        return false;
    }
    /*------------------------------------------------------------------
    [Return if the permission folder exists]
    -------------------------------------------------------------------*/
    public function doesUserGotAccess()
    {
        if (isset($_SESSION['user_access']) && file_exists($_SESSION['user_access'])) {
            return true;
        }
        // default return
        return false;
    }
}