<?php
/**
 * createFolder.php
 * ================
 * This PHP script handles the creation of new folders on the server.
 * It receives folder names via POST requests and creates directories
 * after validating the input for security.
 * 
 * Security Features:
 * - Only allows alphanumeric characters, hyphens, and underscores
 * - Checks if folder already exists
 * - Returns appropriate success/error messages
 */

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the folder name from the POST data
    $folderName = $_POST['folderName'];
    
    // Security check: Only allow alphanumeric characters, hyphens, and underscores
    if (preg_match('/^[a-zA-Z0-9-_]+$/', $folderName)) {
        // Check if folder already exists
        if (is_dir($folderName)) {
            echo "The folder '$folderName' already exists.";
        } else {
            // Attempt to create the folder with full permissions (0777)
            if (mkdir($folderName, 0777)) {
                echo "The folder '$folderName' was successfully created.";
            } else {
                echo "Error: The folder '$folderName' could not be created.";
            }
        }
    } else {
        // Return error message for invalid folder names
        echo "Invalid folder name. Only letters, numbers, hyphens, and underscores are allowed.";
    }
}
?>
