<?php
/**
 * getProjects.php
 * ================
 * This PHP script reads the subdirectories within the 'Befahrungsprojekte' directory
 * and returns them as a JSON array. This is used to populate the project
 * dropdown menu in the user interface.
 */

$projectDir = 'Befahrungsprojekte';
$projects = [];

// Check if the directory exists
if (is_dir($projectDir)) {
    // Scan the directory for subdirectories
    $items = scandir($projectDir);
    foreach ($items as $item) {
        if ($item != '.' && $item != '..' && is_dir($projectDir . '/' . $item)) {
            $projects[] = $item;
        }
    }
}

// Set the content type to JSON
header('Content-Type: application/json');

// Return the projects as a JSON array
echo json_encode($projects);
?>
