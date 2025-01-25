<?php
header('Content-Type: application/json');

// Sicherheitsprüfung
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['error' => 'Method not allowed']));
}

// Parameter validieren
if (!isset($_POST['user']) || !isset($_POST['data'])) {
    http_response_code(400);
    die(json_encode(['error' => 'Missing parameters']));
}

$user = $_POST['user'];
$data = json_decode($_POST['data'], true);

// Pfad zur Benutzerdatei
$userDir = __DIR__ . '/User/' . $user;
$userFile = $userDir . '/user_' . $user . '.json';

// Verzeichnis existenz prüfen
if (!is_dir($userDir)) {
    http_response_code(404);
    die(json_encode(['error' => 'User directory not found']));
}

// Daten validieren
if (!is_array($data)) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid data format']));
}

// Datei schreiben
try {
    file_put_contents($userFile, json_encode($data, JSON_PRETTY_PRINT));
    echo json_encode(['status' => 'success']);
} catch (Exception $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Failed to save user data']));
}
