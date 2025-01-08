<?php
header('Content-Type: application/json');

/**
 * This PHP script reads KML files from a project's KML-Files directory
 */

// Get the project name from the query parameter
$projectName = $_GET['project'];

if (!$projectName) {
    http_response_code(400);
    echo json_encode(['error' => 'Project name is required']);
    exit;
}

$kmlDir = "Befahrungsprojekte/$projectName/KML-Files";

// Check if directory exists
if (!is_dir($kmlDir)) {
    http_response_code(404);
    echo json_encode(['error' => 'Directory not found']);
    exit;
}

// Get all KML files
$kmlFiles = glob("$kmlDir/*.kml");

// Format the response
$files = array_map(function($file) {
    return basename($file);
}, $kmlFiles);

echo json_encode($files);
